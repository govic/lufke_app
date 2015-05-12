angular.module('lufke').controller('ExploreController', function($scope, $http, $ionicPopup) {
    console.log('Inicia...ExploreController ');
    $http.post(api.explore.getPopulars).success(function(data, status, headers, config) {
        $scope.model = data;
    }).error(function(data, status, headers, config) {
        console.dir(data);
        console.dir(status);
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
    $scope.goToProfile = function(profileId) {
        alert('Go to: ' + profileId);
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