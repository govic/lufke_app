angular
.module("lufke")
.directive("userRow", function($state, profileService, $http, $timeout, ShowMessageSrv){
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
                $scope.disabled = true;
                $scope.btnSeguir = "enviando...";
                $http.post(api.explore.followUser, {
                    id: user.profileId
                }).success(function(data, status, headers, config) {
                    $scope.btnSeguir = "siguiendo";
                    user.BeingFollowed = true;
                }).error(function(data, status, headers, config) {
                    console.dir(data);
                    console.dir(status);
                    user.BeingFollowed = false;
                    $scope.disabled = false;
                    $scope.showMessage("Error", "Ha courrido un error al enviar la solicitud.");
                });
            }
        },
        restrict: "E",
        scope: { postsNavegable: "=", user: "=" },
        templateUrl: 'app/templates/directives/user-row.html'
    }
})
