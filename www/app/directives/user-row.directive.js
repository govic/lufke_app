angular
.module("lufke")
.directive("userRow", function($state, profileService){
    return {
        link: function($scope, $element, $attrs){
            $scope.url = url_files;
            $scope.unknown_user = url_user;
            $scope.unknown_background = url_background;
            $scope.unknown_post = url_post;

            $scope.viewProfile = function(){
                profileService.viewprofile($scope.user.profileId);
            }

            $scope.viewPost = function(post){
                if($scope.postsNavegable === true){
                    $state.go("post", { 'postId': pub.id });
                }
            }
        },
        restrict: "E",
        scope: { postsNavegable: "=", user: "=", followEnabled: "=" },
        templateUrl: 'app/templates/directives/user-row.html'
    }
})
