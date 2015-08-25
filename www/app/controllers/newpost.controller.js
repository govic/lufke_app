angular.module('lufke').controller('NewPostController', function($ionicLoading, $rootScope, lodash, $http, $state, $scope, $ionicActionSheet, $localStorage, $ionicPopup, $ionicHistory, PostsService, $stateParams /*, Camera, FileTransfer*/ ) {
    console.log('Inicia ... NewPostController');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.model = {
        mediaSelected: false,
        imageBase64: "",
        experienceText: "",
    };
    $ionicLoading.show();
	
    $http.post(api.user.getProfile)
    .success(function(profile, status, headers, config) {
        $scope.user = profile;
        console.dir($scope.user);
        $ionicLoading.hide();
    }).error(function(data, status, headers, config) {
        console.dir(data);
        console.log(status);
        $ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error al cargar sus datos de perfil.");
    });

    $scope.shareExperience = function() {
        $ionicLoading.show();
        if ($scope.model.mediaSelected || $scope.model.experienceText.length) {
            $http.post(api.post.create, {
                authorId: $localStorage.session,
                text: $scope.model.experienceText,
                imgBase64: $scope.model.mediaSelected ? $scope.model.imageBase64 : "",
                imgMimeType: "image/jpeg" //depende del metodo getPhoto en las opciones
            }).success(function(data, status, headers, config) {
                $scope.model.experienceText = "";
                $scope.model.mediaSelected = false;
                $scope.model.imageBase64 = "";
                $rootScope.$broadcast('newPost', {
                    post: data
                });
				
				if(typeof $stateParams.next === "undefined"){
					$ionicHistory.goBack(1);
				}else{
					$state.go($stateParams.next);
				}
                
                $ionicLoading.hide();
            }).error(function(err, status, headers, config) {
                console.dir(err);
                console.log(status);
                $ionicLoading.hide();
                $scope.showMessage("Error", "Ha ocurrido un error al realizar la publicación.");
            });
        }
    };
    $scope.showImagesOptions = function() {
        var options = $ionicActionSheet.show({
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
                        $scope.getPhoto(navigator.camera.PictureSourceType.CAMARA);
                        break;
                    case 1:
                        $scope.getPhoto(navigator.camera.PictureSourceType.PHOTOLIBRARY);
                        break;
                    default:
                        $scope.showMessage("Error", "Un error desconocido ha ocurrido.");
                        break;
                }
                return true;
            }
        });
    };
    $scope.getPhoto = function(source) {
        var options = {
            quality: 75,
            correctOrientation: true,
            destinationType: navigator.camera.DestinationType.DATA_URL, //DATA_URL,FILE_URI
            encodingType: navigator.camera.EncodingType.JPEG, //PNG,JPEG
            sourceType: source, //CAMARA,PHOTOLIBRARY,SAVEDPHOTOALBUM
            allowEdit: true,
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
            $scope.showMessage("Error", "Ha ocurrido un error al intentar cargar la imagen.");
            $scope.model.mediaSelected = false;
            $scope.model.imageBase64 = "";
        }, options);
        return false;
    };
    $scope.showMessage = function(title, message, callback) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message,
            okText: "Aceptar"
        });
        alertPopup.then(function(res) {
            if (callback) callback();
            return;
        });
    };
});
