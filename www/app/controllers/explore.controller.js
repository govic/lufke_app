angular.module('lufke').controller('ExploreController', function($ionicLoading, profileService, $scope, $http, $ionicPopup) {
    console.log('Inicia...ExploreController ');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $ionicLoading.show();
    $http.post(api.explore.getPopulars)
    .success(function(data, status, headers, config) {
        console.dir(data);
        $scope.model = data;
        $ionicLoading.hide();
    }).error(function(data, status, headers, config) {
        console.dir(data);
        console.dir(status);
        $ionicLoading.hide(); 
        $scope.showMessage("Error", "Ha ocurrido un error al cargar los usuarios populares y las categorías.");
    });
    $scope.updateExploreData = function() {
        $http.post(api.explore.getPopulars).success(function(data, status, headers, config) {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.model = data;
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.dir(status);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar los usuarios populares y las categorías.");
        });
    };
    $scope.allCategories = function() {
        alert('All Categories');
    };
    $scope.followCategory = function(categoryId, categoryName) {
        $http.post(api.explore.followCategory, {
            id: categoryId
        }).success(function(data, status, headers, config) {
            $scope.showMessage(categoryName, "Ya eres seguidor!", function() {});
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.dir(status);
            $scope.showMessage("Error", "Ha courrido un error al enviar la solicitud.");
        });
    };
    $scope.followUser = function(userToFollowId) {
        $http.post(api.explore.followUser, {
            id: userToFollowId
        }).success(function(data, status, headers, config) {
            $scope.showMessage("Mensaje", "Solicitud realizada!", function() {
                //TODO falta hacer efecto visual
            });
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.dir(status);
            $scope.showMessage("Error", "Ha courrido un error al enviar la solicitud.");
        });
    };
    $scope.viewProfile = function(profileId){
        profileService.viewprofile(profileId);
    };
    $scope.allTopUsers = function() {
        alert('All Top Users');
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