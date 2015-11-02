angular
.module("lufke")
.controller("FollowingController", function($ionicHistory, $ionicLoading, $ionicPopup, $http, $scope, $stateParams, $rootScope, profileService, ShowMessageSrv){
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

    function Reload(){
        paginador = { currentPage: 1, limit: 10 };
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

    var $userForsook = $rootScope.$on("user-forsook", function($event, userId){
        userId = parseInt(userId);
        if($scope.following && $scope.following.constructor === Array){
            $scope.following.forEach(function(followed, index){
                if(followed.profileId === userId){
                    $scope.following.splice(index, 1);
                }
            });
        }
    });
    var $followingUser = $rootScope.$on("following-user", Reload);
    var $destroy = $rootScope.$on("$destroy", function(){
        $userForsook();
        $followingUser();
        $destroy();
    });

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

    function Reload(){
        paginador = { currentPage: 1, limit: 10 };
        $scope.following = [];
        GetFollowing(paginador, function(err){
            if(err){
                console.error(err);
                $scope.showMessage("Error", "¡¡¡Ups!!! ha ocurrido un error con Lufke.");
            }else{
                paginador.currentPage++;
            }
            $ionicLoading.hide();
        });
    }

    var followingUser = $rootScope.$on("following-user", Reload);
    var userForsook = $rootScope.$on("user-forsook", Reload);
    var destroy = $rootScope.$on("$destroy", function(){
        destroy();
        followingUser();
        userForsook();
    });

});
