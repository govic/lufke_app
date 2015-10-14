angular.module('lufke').controller('NewPostController', function(fb, $base64, $ionicLoading, $rootScope, lodash, $http, $state, $scope, $ionicActionSheet, $localStorage, $ionicPopup, $ionicHistory, PostsService, $stateParams, ShowMessageSrv, maxExperienceTextSize, SelectedCategoriesSrv, SelectedUsersSrv /*, Camera, FileTransfer*/ ) {
    console.log('Inicia ... NewPostController');

    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.model = {
        mediaSelected: false,
        imageBase64: ""
    };

    $scope.experienceTextCounter = maxExperienceTextSize;
    Object.defineProperty($scope.model, "experienceText", {
        get: function(){ return this._experienceTextValue; },
        set: function(_val){
            if(typeof _val === "string" && _val.length <= maxExperienceTextSize){
                this._experienceTextValue = _val;
                $scope.experienceTextCounter = maxExperienceTextSize - this._experienceTextValue.length;
            }
        }
    });

    function Reset(){
        SelectedCategoriesSrv.reset();
        SelectedUsersSrv.reset();
        $scope.friends = [];
        $scope.interests = [];
        $scope.model.experienceText = "";
        $scope.model.mediaSelected = false;
        $scope.model.imageBase64 = "";
        $scope.shareToFacebook = false;
    }


    $scope.cancel = function(){
        Reset();
        $ionicHistory.goBack();
        SelectedCategoriesSrv.reset();
    }
    $scope.shareExperience = function() {
        $ionicLoading.show();
        if ($scope.model.mediaSelected || $scope.model.experienceText.length) {
            var _newPost = {
                authorId: $localStorage.session,
                text: $scope.model.experienceText,
                imgBase64: $scope.model.mediaSelected ? $scope.model.imageBase64 : "",
                imgMimeType: "image/jpeg" //depende del metodo getPhoto en las opciones
            };

            //Agregamos los usuarios relacionados al post.
            var interests = SelectedCategoriesSrv.get();
            _newPost.Interests = [];
            interests.forEach(function(interest){
                _newPost.Interests.push({ interestId: interest.interestId });
            });

            //Agregamos los intereses relacionados al post.
            var users = SelectedUsersSrv.get();
            _newPost.Friends = [];
            users.forEach(function(user){
                _newPost.Friends.push({ profileId: user.profileId });
            });

            $http.post(api.post.create, _newPost).success(function(data, status, headers, config) {
                $rootScope.$emit('newPost', { post: data });

				if(typeof $stateParams.next === "undefined"){
					$ionicHistory.goBack(1);
				}else{
					$state.go($stateParams.next);
				}

                if(loginData && $scope.shareToFacebook === true){
                    var _params = { access_token: loginData.access_token };

                    if(typeof data["backgroundImgUrl"] !== "undefined" && typeof data["backgroundImgUrl"] !== "null" && data["backgroundImgUrl"].trim().length > 0){
                        var _url = fb.postMessage.replace(/feed$/, "photos");
                        _params.caption = _newPost.text;
                        _params.url = url_files + data["backgroundImgUrl"];
                    }else{
                        var _url = fb.postMessage;
                        _params.message = _newPost.text;
                    }
                    $http
                        .post(_url, {}, { params: _params })
                        .success(function(user, status, headers, config) {
                            //Retorna el id del posts.
                            Reset();
                        })
                        .error(function(data){
                            console.log(data);
                            $scope.showMessage("Error", "Ha ocurrido un error al publicar tu estado en facebook.");
                            Reset();
                        });
                }else{
                    Reset();
                }

                SelectedCategoriesSrv.reset();
                SelectedUsersSrv.reset();
                $ionicLoading.hide();
            }).error(function(err, status, headers, config) {
                console.dir(err);
                console.log(status);
                $ionicLoading.hide();
                $scope.showMessage("Error", "Ha ocurrido un error al realizar la publicación.");
            });
        }
    };
    $scope.ShareToFacebook = function(){
        $scope.shareToFacebook = !$scope.shareToFacebook;
    }
    $scope.showImagesOptions = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [{
                text: '<i class="ion-share"></i> <span>Photo</span>'
            }, {
                text: '<i class="ion-flag"></i> <span>Gallery</span>'
            }],
            cancelText: 'Cancelar',
            cancel: function() {},
            buttonClicked: function(index) {
                //console.log("presionado botón nro: " + index);
                switch (index) {
                    case 0:
                        GetPhoto(navigator.camera.PictureSourceType.CAMARA);
                        break;
                    case 1:
                        GetPhoto(navigator.camera.PictureSourceType.PHOTOLIBRARY);
                        break;
                    default:
                        $scope.showMessage("Error", "Un error desconocido ha ocurrido.");
                        break;
                }
                return true;
            }
        });
    };
    function GetPhoto(source) {
        var options = {
            allowEdit: false,
            correctOrientation: true,
            destinationType: navigator.camera.DestinationType.DATA_URL, //DATA_URL,FILE_URI
            encodingType: navigator.camera.EncodingType.JPEG, //PNG,JPEG
            quality: 75,
            sourceType: source, //CAMARA,PHOTOLIBRARY,SAVEDPHOTOALBUM
            targetWidth: 420,
            targetHeight: 420
        };
         $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
        });
        navigator.camera.getPicture(function(imageBase64) {
            $scope.model.mediaSelected = true;
            $scope.model.imageBase64 = imageBase64;
            $ionicLoading.hide();
        }, function(err) {
            console.log(err)
            if(!/cancel/.test(err)) $scope.showMessage("Error", "Ha ocurrido un error al intentar cargar la imagen.");
            $scope.model.mediaSelected = false;
            $scope.model.imageBase64 = "";
            $ionicLoading.hide();
        }, options);
        return false;
    };
    $scope.showMessage = ShowMessageSrv;
    $scope.shareToFacebook = false;
    $scope.enableToShare = false;

    var loginData = $localStorage["login-data"];
    if(loginData){
        try{
            loginData = JSON.parse( $base64.decode( loginData ) );
            $scope.enableToShare = true;
        }catch(e){
            $scope.enableToShare = false;
        }
    }

    var $onIntersetsAdded = $rootScope.$on("new-post-interest-added", function(){
        SetInterests();
    });
    var $onFriendsAdded = $rootScope.$on("new-post-friend-added", function(){
        SetFriends();
    });

    var $destroy = $scope.$on("$destroy", function(){
        $onIntersetsAdded();
        $onFriendsAdded();
        $destroy();
    });

    $ionicLoading.show();
    $http.post(api.user.getProfile, {}, { cache: true })
        .success(function(profile, status, headers, config) {
            $scope.user = profile;
            $ionicLoading.hide();
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.log(status);
            $ionicLoading.hide();
            $scope.showMessage("Error", "Ha ocurrido un error al cargar sus datos de perfil.");
        });

    function SetInterests(){
        $scope.interests = [];
        var interests = SelectedCategoriesSrv.get();
        if(interests && interests.constructor === Array){
            $scope.interests = interests.concat([]);
        }
        interests = null;
    }

    function SetFriends(){
        //mostrar usuarios seleccionados.
        $scope.friends = [];
        var friends = SelectedUsersSrv.get();
        if(friends && friends.constructor === Array){
            $scope.friends = friends.concat([]);
        }
        friends = null;
    }

    SetFriends();
    SetInterests();

}).factory("SelectedCategoriesSrv", function(lodash){
    //Servicio utilizado entre NewPostController y SearchInterestController al momento de seleccionar las categorias en este ultimo controller.
    return {
        _values: [],
        add: function(interest){
            this._values.push( interest );
        },
        remove: function( interest ){
            var _interest = lodash.find( this._values, function(_interest){
                return _interest.interestName === interest.interestName;
            });
            if(_interest) this._values.splice(this._values.indexOf( _interest ), 1 );
        },
        reset: function(){
            this._values = [];
        },
        get: function(){
            return this._values.concat([]);
        },
        set: function(_array){
            this._values = _array;
        }
    }
}).factory("SelectedUsersSrv", function(lodash){
    //Servicio utilizado entre NewPostController y SearchInterestController al momento de seleccionar los usuarios en este ultimo controller.
    return new function(){
        var values = [];
        this.add = function(item){
            values.push( item );
        };
        this.remove = function( item ){
            var _item = lodash.find( values, function(_item){
                return _item.profileId === item.profileId;
            });
            if(_item) values.splice(values.indexOf( _item ), 1 );
        };
        this.reset = function(){
            values = [];
        }
        this.get = function(){
            return values.concat([]);
        }
        this.set = function(_array){
            values = _array;
        }
    }
});
