angular.module('lufke').controller('PostController', function($rootScope, $ionicLoading, profileService, lodash, $http, $scope, $state, $localStorage, $stateParams, $ionicHistory, $ionicPopup, $ionicActionSheet, PageInfoSrv, $cordovaInAppBrowser, ScanUri) {
    console.log('Inicia ... PostController');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_post = url_post;
    $scope.showImage = false;

    $scope.cancel = function(){
        $scope.model.commentText = "";
        $ionicHistory.goBack(1);
    }
    $scope.updatePost = function() {
        $http.post(api.post.get, {
            id: $stateParams.postId
        }).success(function(post) {
            $scope.model.post = post;
            $scope.$broadcast('scroll.refreshComplete');
        }).error(function(data) {
            console.dir(data);
            $scope.showMessage("Error", "Ha ocurrido un error al refrescar la publicación.");
        });
    };
    $scope.toggleLike = function() {
        $scope.model.post.isLiked = !$scope.model.post.isLiked;
        if($scope.model.post.isLiked === true){
            $scope.model.post.totalStars++;
        }else{
            $scope.model.post.totalStars--;
        }
        $http.post(api.post.toggleLike, {
            id: $scope.model.post.id
        }).success(function(){
            $rootScope.$emit("toggle-like", { id: $scope.model.post.id, isLiked: $scope.model.post.isLiked, totalStars: $scope.model.post.totalStars });
        }).error(function(data) {
            $scope.showMessage("Error", "Ha ocurrido un error al realizar tu petición. Revisa tu conexión a internet.");
            $scope.model.post.isLiked = !$scope.model.post.isLiked;
            if($scope.model.post.isLiked === true){
                $scope.model.post.totalStars++;
            }else{
                $scope.model.post.totalStars--;
            }
        });
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
    $scope.showMore = function() {
        var options = $ionicActionSheet.show({
            buttons: [{
                    text: '<i class="ion-share"></i> <span>Compartir</span>'
                }, //Index = 0
                {
                    text: '<i class="ion-flag"></i> <span>Reportar</span>'
                } //Index = 1
            ],
            destructiveText: $localStorage.session == $scope.model.post.authorId ? '<i class="ion-trash-b"></i> <span>Borrar</span>' : null,
            cancelText: 'Cancelar',
            cancel: function() {
                //Hacer nada
            },
            destructiveButtonClicked: function() {
                var confirm = $ionicPopup.confirm({
                    title: 'Confirmación',
                    template: '¿Está seguro que desea borrar esta publicación?',
                    cancelText: 'No',
                    cancelType: 'button-positive',
                    okText: 'Sí',
                    okType: 'button-light'
                });
                confirm.then(function(res) {
                    if (res) {
                        $http.post(api.post.delete, {
                            id: $scope.model.post.id
                        }).success(function(){
                            if ($ionicHistory.backView()) {
                                $ionicHistory.goBack();
                                return;
                            } else {
                                $state.go("tab.news");
                                return;
                            }
                        }).error(function(data){
                            console.dir(data);
                            $scope.showMessage("Error", "Ha ocurrido un error al borrar la publicación");
                        });
                    }
                });
                return true; //Close the model?
            },
            buttonClicked: function(index) {
                console.log("presionado botón nro: " + index);
                switch (index) {
                    case 0:
                        PostsService.sharePost($stateParams.postId);
                        break;
                    case 1:
                        var confirm = $ionicPopup.confirm({
                            title: 'Confirmación',
                            template: '¿Está seguro que desea reportar esta publicación?',
                            cancelText: 'No',
                            cancelType: 'button-positive',
                            okText: 'Sí',
                            okType: 'button-light'
                        });
                        confirm.then(function(res) {
                            if (res) {
                                PostsService.reportPost($stateParams.postId);
                                $scope.showMessage("Se ha reportado la publicación.");
                            }
                        });
                        break;
                    default:
                        $scope.showMessage("Error", "Un error desconocido ha ocurrido.");
                        break;
                }
                return true;
            }
        });
    };
    $scope.addComment = function() {
        $http.post(api.post.comment.create, {
            postId: $stateParams.postId,
            text: $scope.model.commentText
        }).success(function(comment) {
            //post.backgroundImgUrl = getPostBackgroundUlr(post);
            $scope.model.post.comments.push(comment);
            $scope.model.commentText = "";
            $rootScope.$emit("comment-added", { id: comment.id, postId: parseInt($stateParams.postId) });
        }).error(function(data) {
            console.dir(data);
            $scope.showMessage("Error", "Ha ocurrido un error al crear su comentario.");
        });
    };
    $scope.showDeleteComment = function(commentId) {
        if ($scope.model.post.authorId == $localStorage.session || lodash.some($scope.model.post.comments, {
            'id': commentId,
            'authorId': $localStorage.session
        })) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Borrar comentario',
                template: '¿Está seguro que desea borrar este comentario?',
                cancelText: 'No',
                okText: 'Sí',
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $http.post(api.post.comment.delete, {
                        id: commentId
                    }).success(function() {
                        lodash.remove($scope.model.post.comments, function(item) {
                            return item.id == commentId;
                        });
                        $rootScope.$emit("comment-deleted", { id: commentId, postId: parseInt($stateParams.postId) });
                    }).error(function(data) {
                        console.dir(data);
                        $scope.showMessage("Error", "Ha ocurrido un error al eliminar el comentario.");
                    });
                }
            });
        }
    };
    $scope.viewProfile = function(authorId){
        profileService.viewprofile(authorId);
    };
    $scope.triggerLink = function($event){
        if($scope.link && $scope.link.href){
            $cordovaInAppBrowser.open($scope.link.href, "_system");
        }
    }
    $scope.triggerHref = function(url){
        if(url){
            $cordovaInAppBrowser.open(url, "_system");
        }
    }

    var $toggleLike = $rootScope.$on("toggle-like", function(e, args){
        //{ id: <int>, isLiked: <bool> }
        $scope.model.post.isLiked = args.isLiked;
        $scope.model.post.totalStars = args.totalStars;
    });
    var $destroy = $rootScope.$on("$destroy", function(){
        $toggleLike();
        $destroy();
    });

    function ShowBackgroundImgUrl(){
        if($scope.model.post.backgroundImgUrl !== null && $scope.model.post.backgroundImgUrl !== ''){
            $scope.post_url = $scope.url + $scope.model.post.backgroundImgUrl;
            $scope.showImage = true;
        }
    }

    $scope.post_url = null;
    $scope.link = null;

    $ionicLoading.show();
    $http.post(api.post.get, {
        id: $stateParams.postId
    }).success(function(post) {

        /*
        var _url = ScanUri(post.text);

        //Si existe algun link en el texto, le agregamos los links correspondientes a un tag "a"
        if(_url){
            console.log(_url)
            post.text = post.text.replace(_url, "<a ng-click='triggerHref(\"" + _url + "\")'>" + _url + "</a>" )
            console.log(post.text)
        }*/

        $scope.model = {
            post: post,
            commentText: ""
        };

        if(post.text){
            //Buscamos si en el texto del post existe algún enlace inserto.
            var uri = ScanUri(post.text);

            if(uri){
                var promise = PageInfoSrv.scan( uri );
                promise.then(function(data){
                    if(data.from === "youtube"){
                        var _link = {
                            content: data ? (data.items ? (data.items[0] ? (data.items[0].snippet ? data.items[0].snippet.description : ""): "" ): ""): "",
                            href: data.url,
                            preview: data ? (data.items ? (data.items[0] ? (data.items[0].snippet ? (data.items[0].snippet.thumbnails ? (data.items[0].snippet.thumbnails.default ? data.items[0].snippet.thumbnails.default.url : ""): "") : ""): "" ): ""): "",
                            title: data ? (data.items ? (data.items[0] ? (data.items[0].snippet ? data.items[0].snippet.title : ""): "" ): ""): ""
                        };
                        _link.content = _link.content && _link.content.length > 200 ? _link.content.substr(0, 197) + "..." : _link.content;
                        _link.title = _link.title && _link.title.length > 100 ? _link.title.substr(0, 97) + "..." : _link.title;

                        $scope.link = _link;
                        $scope.showImage = true;
                    }else{
                        if(!data || data.error || (!data.title && !data.description)){
                            var _link = null;
                        }else{
                            var _link = {
                                content: data.description,
                                href: data.url,
                                title: data.title
                            }
                            if(data.faviconUrl){
                                //faviconUrl es una url escaneada del codigo html de la página y que puede tener un valor variable.
                                _link.preview = data.faviconUrl;
                            }else if(data.favicon){
                                //favicon es la url por defecto del favicon de una página. Ej: <host>/favicon.ico.
                                _link.preview = data.favicon;
                            }
                            _link.content = _link.content && _link.content.length > 200 ? _link.content.substr(0, 197) + "..." : _link.content;
                            _link.title = _link.title && _link.title.length > 100 ? _link.title.substr(0, 97) + "..." : _link.title;
                            $scope.showImage = true;
                        }

                        $scope.link = _link;

                        if(!_link){
                            ShowBackgroundImgUrl()
                        }
                    }
                }, function(err){
                    $scope.link = null;
                    ShowBackgroundImgUrl();
                })
            }else{
                ShowBackgroundImgUrl();
            }
        }else{
            ShowBackgroundImgUrl();
        }

        $ionicLoading.hide();
    }).error(function(data) {
        console.dir(data);
        $ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error al cargar la publicación.", function() {
            $state.go('tab.news');
            return;
        });
    });
})
.directive("bindLink", function(ScanUri, $cordovaInAppBrowser){
    return {
        controller: function($scope, $element){
            var uri = null;
            function Click(e){
                if(uri){
                    $cordovaInAppBrowser.open(uri, "_system");
                }
                e.preventDefault();
            }
            var $destroy = $scope.$on("$destroy", function(){
                $element[0].removeEventListener("click", Click);
                $destroy();
            });
            Object.defineProperty($scope, "postText", {
                get: function(){
                    if($scope.model && $scope.model.post && $scope.model.post.text){
                        uri = ScanUri($scope.model.post.text);
                        //Si existe...
                        if(uri){
                            //...reemplazamos el texto plano del enlace por un tag "a".;
                            $element.html($scope.model.post.text.replace(uri, "<a href='" + uri  + "'>" + uri + "</a>"));
                            $element[0].addEventListener("click", Click);
                            return "";
                        }else{
                            return $scope.model.post.text;
                        }
                    }else{
                        return "";
                    }
                }
            })

        },
        restrict: 'A',
        scope: false,
        template: '<span ng-bind-html="postText"></span>'
    }
});
