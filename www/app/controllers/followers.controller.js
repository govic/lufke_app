angular
.module("lufke")
.controller("FollowersController", function($rootScope, $ionicHistory, $ionicLoading, $ionicPopup, $http, $scope, $stateParams, profileService, $localStorage, ShowMessageSrv){
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = "/" + url_background;
    $scope.unknown_post = url_post;


    $scope.cancel = function(){
        $ionicHistory.goBack();
    }
    $scope.showMessage = ShowMessageSrv;

    $scope.more = function(){
        GetFollowers(paginador, function(err){
            if(err){
                console.error(err);
                $scope.showMessage("Error", "¡¡¡Ups!!! ha ocurrido un error con Lufke.");
            }else{
                paginador.currentPage++;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }

    function Reload(){
        paginador = { currentPage: 1, limit: 10 };
        GetFollowers(paginador, function(err){
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
        if($scope.followers && $scope.followers.constructor === Array){
            $scope.followers.forEach(function(follower, index){
                if(follower.profileId === userId){
                    follower.BeingFollowed = false;
                }
            });
        }
    });
    var $followingUser = $rootScope.$on("following-user", function($event, userId){
        userId = parseInt(userId);
        if($scope.followers && $scope.followers.constructor === Array){
            $scope.followers.forEach(function(follower, index){
                if(follower.profileId === userId){
                    follower.BeingFollowed = true;
                }
            });
        }
    });
    var $destroy = $rootScope.$on("$destroy", function(){
        $userForsook();
        $followingUser();
        $destroy();
    });


    function GetFollowers(obj, cb){
        $http
            .get( api.user.followers + "?page=" + obj.currentPage.toString() + "&limit=" + obj.limit.toString() + "&userId=" + $stateParams.userid, { cache: false }
            ).success(function(followers){
                $scope.followers = $scope.followers.concat( followers );
                $scope.moreData = followers.length > 0;

                $scope.msg = followers && followers.length > 0 ? null : "No hay más seguidores";
                $scope.msg = $scope.followers && $scope.followers.length > 0 ? null : "No hay seguidores";

                cb( null );
            }).error(function(){
                cb( arguments );
            });
    }

    var paginador = { currentPage: 1, limit: 10 };

    $scope.followers = [];
    $scope.moreData = false;
    $ionicLoading.show();

    GetFollowers(paginador, function(err){
        if(err){
            console.error(err);
            $scope.showMessage("Error", "¡¡¡Ups!!! ha ocurrido un error con Lufke.");
        }else{
            paginador.currentPage++;
        }
        $ionicLoading.hide();
    });
});
