angular
.module("lufke")
.directive("userRow", function($rootScope, $state, profileService, $http, $timeout, ShowMessageSrv, $ionicPopup, TrackingStatus){
    return {
        link: function($scope, $element, $attrs){
            $scope.url = url_files;
            $scope.unknown_user = url_user;
            $scope.unknown_background = url_background;
            $scope.unknown_post = url_post;
            $scope.showMessage = ShowMessageSrv;
            $scope.btnSeguir = "SEGUIR";
            $scope.disabled = false;

            $scope.viewProfile = function(){
                profileService.viewprofile($scope.user.profileId);
            }
            $scope.viewPost = function(post){
                if($scope.postsNavegable === true){
                    $state.go("tab.post", { 'postId': post.id });
                }
            }
            $scope.followUser = function(user){
                if(user.BeingFollowed){
                    var confirm = $ionicPopup.confirm({
                        cancelText: "No",
                        okText: "Sí",
                        template: "¿Estas seguro de dejar de seguir a " + user.profileFirstName + "?",
                        title: "dejar de seguir"
                    });
                    confirm.then(function(res){
                        if(res){
                            $scope.disabled = true;
                            $scope.btnSeguir = "enviando...";
                            user.BeingFollowed = false;
                            $http.post(api.notifications.forsakeUser, {
                                id: user.profileId
                            }).success(function(data, status, headers, config) {
                                $scope.btnSeguir = "SEGUIR";
                                $scope.disabled = false;
                                $rootScope.$emit("user-forsook");
                            }).error(function(data, status, headers, config) {
                                console.dir(data);
                                console.dir(status);
                                user.BeingFollowed = true;
                                $scope.disabled = false;
                                $scope.showMessage("Error", "Ha courrido un error al enviar la solicitud.");
                            });
                        }
                    });
                }else{
                    $scope.disabled = true;
                    $scope.btnSeguir = "enviando...";
                    $http.post(api.explore.followUser, {
                        id: user.profileId
                    }).success(function(data, status, headers, config) {
                        if(TrackingStatus.Accepted == data){
                            $rootScope.$emit("following-user", user.profileId);
                        }
                        $scope.btnSeguir = "siguiendo";
                        user.BeingFollowed = true;
                        $scope.disabled = false;
                    }).error(function(data, status, headers, config) {
                        console.dir(data);
                        console.dir(status);
                        user.BeingFollowed = false;
                        $scope.disabled = false;
                        $scope.showMessage("Error", "Ha courrido un error al enviar la solicitud.");
                    });
                }
            }
        },
        restrict: "E",
        scope: { postsNavegable: "=", user: "=" },
        templateUrl: 'app/templates/directives/user-row.html'
    }
})
