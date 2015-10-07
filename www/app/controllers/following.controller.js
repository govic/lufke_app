angular
.module("lufke")
.controller("FollowingController", function($ionicHistory, $ionicLoading, $ionicPopup, $http, $scope, $stateParams, profileService, ShowMessageSrv){
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = "/" + url_background;
    $scope.unknown_post = url_post;
    $scope.msg = "buscando...";

    $scope.cancel = function(){
        $ionicHistory.goBack();
    }
    $scope.showMessage = ShowMessageSrv;

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
                $scope.moreData = following.length > 0;

                $scope.msg = following && following.length > 0 ? null : "No hay más personas";
                $scope.msg = $scope.following && $scope.following.length > 0 ? null : "Sin personas a quien se siga";

                cb( null );
            }).error(function(){
                cb( arguments );
            });
    }

    var paginador = { currentPage: 1, limit: 10 };

    $scope.following = [];
    $scope.moreData = false;
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
