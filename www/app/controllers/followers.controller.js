angular
.module("lufke")
.controller("FollowersController", function($ionicLoading, $ionicPopup, $http, $scope, $stateParams, profileService, $localStorage){
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

    function GetFollowers(obj, cb){
        $http
            .get( api.user.followers + "?page=" + obj.currentPage.toString() + "&limit=" + obj.limit.toString() + "&userId=" + $stateParams.userid, { cache: false }
            ).success(function(followers){
                $scope.followers = $scope.followers.concat( followers );
                $scope.moreFollowers = followers.length > 0;
                $scope.sinSeguidores = $scope.followers.length === 0;

                cb( null );
            }).error(function(){
                cb( arguments );
            });
    }

    var paginador = { currentPage: 1, limit: 10 };

    $scope.followers = [];
    $scope.moreFollowers = false;
    $scope.sinSeguidores = false;
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
