angular.module('lufke').controller('PublicProfileController', function($ionicLoading, lodash, $scope, $ionicPopup, $http, $stateParams, $state) {
    console.log('Inicia ... PublicProfileController');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $scope.adn = url_adn;
    $scope.background;
    $ionicLoading.show();
	
    console.dir($stateParams.profileId);
    
    $scope.updateProfileData = function() {
        console.dir($stateParams.profileId);
        
        GetPublicProfile();
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

    $scope.followers = function(){
        $state.go('followers', { userid: $stateParams.profileId });
    }
    $scope.following = function(){
        $state.go('following', { userid: $stateParams.profileId });
    }
    $scope.news = function(){
        $state.go("usernews", { userId: $scope.model.profileId });
    }
    
    function GetPublicProfile(){
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
    }
    

    $http.get(api.user.interests + "?userId=" + $stateParams.profileId.toString()).success(function(data, status, headers, config) {
        $scope.interests = data || [];
    }).error(function(err, status, headers, config) {
        console.dir(err);
        console.log(status);
        $scope.showMessage("Error", "Ha ocurrido un error al cargar los datos del perfil.");
    });
    
    GetPublicProfile();
});
