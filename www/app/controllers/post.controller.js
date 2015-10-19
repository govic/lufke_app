angular.module('lufke').controller('PostController', function($ionicLoading, profileService, lodash, $http, $scope, $state, $localStorage, $stateParams, $ionicHistory, $ionicPopup, $ionicActionSheet) {
    console.log('Inicia ... PostController');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_post = url_post;

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
    $scope.addComment = function() {
        $http.post(api.post.comment.create, {
            postId: $stateParams.postId,
            text: $scope.model.commentText
        }).success(function(comment) {
            //post.backgroundImgUrl = getPostBackgroundUlr(post);
            $scope.model.post.comments.push(comment);
            $scope.model.commentText = "";
        }).error(function(data) {
            console.dir(data);
            $scope.showMessage("Error", "Ha ocurrido un error al crear su comentario.");
        });
    };
    $scope.toggleLike = function() {
        $http.post(api.post.toggleLike, {
            id: $scope.model.post.id
        }).error(function(data) {
            $scope.showMessage("Error", "Ha ocurrido un error al realizar tu petición. Revisa tu conexión a internet.");
        });
        $scope.model.post.isLiked = !$scope.model.post.isLiked;
        if($scope.model.post.isLiked === true){
            $scope.model.post.totalStars++;
        }else{
            $scope.model.post.totalStars--;
        }
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

    $ionicLoading.show();
    $http.post(api.post.get, {
        id: $stateParams.postId
    }).success(function(post) {
        $scope.model = {
            post: post,
            commentText: ""
        };

        if($scope.model.post.backgroundImgUrl !== null && $scope.model.post.backgroundImgUrl !== ''){
            $scope.post_url = $scope.url + $scope.model.post.backgroundImgUrl;
        }
        else{
            $scope.post_url = $scope.unknown_post;
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
});
