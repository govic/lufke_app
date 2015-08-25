angular
.module("lufke")
.controller("FollowingController", function($ionicLoading, $ionicPopup, $http, $scope, $stateParams, profileService){
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = "/" + url_background;
    $scope.unknown_post = url_post;

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

    $scope.more = function(){
        GetFollowing(paginador, function(err){
            if(err){
                console.error(err);
                $scope.showMessage("Error", "¡¡¡Ups!!! ha ocurrido un error con Lufke.");
            }else{
                paginador.currentPage++;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }

    $scope.viewProfile = function(userId){
        profileService.viewprofile(userId);
    }

    function GetFollowing(obj, cb){
        $http
            .get( api.user.following + "?page=" + obj.currentPage.toString() + "&limit=" + obj.limit.toString() + "&userId=" + $stateParams.userid, { cache: false }
            ).success(function(following){
                $scope.following = $scope.following.concat( following );
                $scope.morefollowing = following.length > 0;
                $scope.sinSeguiendo = $scope.following.length === 0;

                cb( null );
            }).error(function(){
                cb( arguments );
            });
    }

    var paginador = { currentPage: 1, limit: 10 };

    $scope.following = [];
    $scope.morefollowing = false;
    $scope.sinSeguiendo = false;
    $ionicLoading.show();

    GetFollowing(paginador, function(err){
        if(err){
            console.error(err);
            $scope.showMessage("Error", "¡¡¡Ups!!! ha ocurrido un error con Lufke.");
        }else{
            paginador.currentPage++;
        }
        $ionicLoading.hide();
    });
});
