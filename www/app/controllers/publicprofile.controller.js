angular.module('lufke').controller('PublicProfileController', function($ionicLoading, lodash, $scope, $ionicPopup, $http, $stateParams) {
    console.log('Inicia ... PublicProfileController');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $scope.adn = url_adn;
    $scope.even = [];
    $scope.odd = [];
    $scope.background;
    $ionicLoading.show();
    console.dir($stateParams.profileId);
    $http.post(api.user.getPublicProfile, {
        profileId: $stateParams.profileId
    }).success(function(publicProfile, status, headers, config) {
        $scope.model = publicProfile;
        console.dir($scope.model);
        if($scope.model.backgroundImgUrl !== null && $scope.model.backgroundImgUrl !== ''){
            $scope.background = $scope.url + $scope.model.backgroundImgUrl;
        }
        else{
            $scope.background = $scope.unknown_background;
        }
         lodash.forEach($scope.model.interests, function(interest){
            if(lodash.indexOf($scope.model.interests, interest) % 2 === 0){
                $scope.odd.push(interest);
            }
            else{
                $scope.even.push(interest);
            }
        });
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
             $scope.even = [];
            $scope.odd = [];
            $scope.model = publicProfile;
            if($scope.model.backgroundImgUrl !== null && $scope.model.backgroundImgUrl !== ''){
                $scope.background = $scope.url + $scope.model.backgroundImgUrl;
            }
            else{
                $scope.background = $scope.unknown_background;
            }
            lodash.forEach($scope.model.interests, function(interest){
                if(lodash.indexOf($scope.model.interests, interest) % 2 === 0){
                    $scope.odd.push(interest);
                }
                else{
                    $scope.even.push(interest);
                }
            });
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