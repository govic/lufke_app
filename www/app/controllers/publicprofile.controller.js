angular.module('lufke').controller('PublicProfileController', function($rootScope, $ionicLoading, lodash, $scope, $ionicPopup, $http, $stateParams, $state, $ionicHistory, $timeout, ShowMessageSrv) {
    console.log('Inicia ... PublicProfileController');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $scope.adn = url_adn;
    $scope.background;

    $scope.disabled = false;
    $scope.btnSeguir = "Seguir";


    console.dir($stateParams.profileId);

    $scope.back = function(){
        $ionicHistory.goBack();
    }
    $scope.updateProfileData = function() {
        console.dir($stateParams.profileId);

        GetPublicProfile();
    };
    $scope.showMessage = ShowMessageSrv;

    $scope.followers = function(){
        $state.go('followers', { userid: $stateParams.profileId });
    }
    $scope.following = function(){
        $state.go('following', { userid: $stateParams.profileId });
    }
    $scope.news = function(){
        $state.go("usernews", { userId: $scope.model.profileId });
    }
    $scope.follow = function(){
        $scope.disabled = true;
        $scope.btnSeguir = "enviando...";
        $http.post(api.explore.followUser, {
            id: $stateParams.profileId
        }).success(function(data, status, headers, config) {
            $rootScope.$emit("following-user");
            $scope.btnSeguir = "siguiendo";
            $timeout(function(){
                $scope.model.BeingFollowed = true;
            }, 3000)
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.dir(status);
            $scope.followEnabled = true;
            $scope.disabled = false;
            $scope.showMessage("Error", "Ha courrido un error al enviar la solicitud.");
        });
    }

    function GetPublicProfile(){
        $ionicLoading.show();
        $http.post(api.user.getPublicProfile, {
            profileId: $stateParams.profileId
        }).success(function(publicProfile, status, headers, config) {
            $scope.model = publicProfile;

            if($scope.model.backgroundImgUrl !== null && $scope.model.backgroundImgUrl !== ''){
                $scope.background = $scope.url + $scope.model.backgroundImgUrl;
            }
            else{
                $scope.background = $scope.unknown_background;
            }
            $ionicLoading.hide();
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.log(status);
            $ionicLoading.hide();
            $scope.showMessage("Error", "Ha ocurrido un error al cargar los datos del perfil.");
        });

        $http.get(api.user.interests + "?userId=" + $stateParams.profileId.toString()).success(function(data, status, headers, config) {
            $scope.interests = data || [];
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar los datos del perfil.");
        });
    }

    GetPublicProfile();
});
