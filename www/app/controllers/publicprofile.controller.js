angular.module('lufke').controller('PublicProfileController', function($ionicLoading, lodash, $scope, $ionicPopup, $http, $stateParams) {
    console.log('Inicia ... PublicProfileController');
    $scope.url = url_files;
    $scope.unknown_user = url_unknown;
    $ionicLoading.show();
    console.dir($stateParams.profileId);
    $http.post(api.user.getPublicProfile, {
        profileId: $stateParams.profileId
    }).success(function(publicProfile, status, headers, config) {
        $scope.model = publicProfile;
        $ionicLoading.hide();
    }).error(function(data, status, headers, config) {
        console.dir(data);
        console.log(status);
        $ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error al cargar los datos del perfil.");
    });
    $scope.updateProfileData = function() {
        console.dir($stateParams.profileId);
        $http.post(api.user.getPublicProfile, {
            profileId: $stateParams.profileId
        }).success(function(publicProfile, status, headers, config) {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.model = publicProfile;
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar los datos del perfil.");
        });
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
});