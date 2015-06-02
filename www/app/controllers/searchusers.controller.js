angular.module('lufke').controller('SearchUsersController', function(lodash, $scope, $ionicPopup, $http, $ionicLoading) {
    console.log('Inicia ... SearchUsersController');
    $ionicLoading.show();
    $http.post(api.explore.getSearchUsers, {
        page: 0
    }).success(function(data, status, headers, config) {
        $scope.model = data;
        $ionicLoading.hide();
    }).error(function(err, status, headers, config) {
        console.dir(err);
        console.dir(status);
        $ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error al cargar los usuarios populares.");
    });
    $scope.updateData = function() {
        $http.post(api.explore.getSearchUsers, {
            page: 0
        }).success(function(data, status, headers, config) {
            $scope.model = data;
            $scope.$broadcast('scroll.refreshComplete');
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.dir(status);
            $scope.$broadcast('scroll.refreshComplete');
            $scope.showMessage("Error", "Ha ocurrido un error al cargar los usuarios populares.");
        });
    };
    $scope.search = function() {
        $ionicLoading.show();
        $http.post(api.explore.getSearchUsers, {
            page: 0, //siempre la busqueda se hace por primera pagina
            searchText: $scope.model.searchText
        }).success(function(data, status, headers, config) {
            $scope.model = data;
            $ionicLoading.hide();
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.dir(status);
            $ionicLoading.hide();
            $scope.showMessage("Error", "Ha ocurrido un error al realizar la búsqueda solicitada.");
        });
    };
    $scope.followUser = function(item) {
        $ionicLoading.show();
        $http.post(api.explore.followUser, {
            id: item.profileId
        }).success(function(data, status, headers, config) {
            $scope.model.users.splice($scope.model.users.indexOf(item), 1);
            $ionicLoading.hide();
            $scope.showMessage("Exito", "Solicitud realizada exitosamente!");
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.dir(status);
            $ionicLoading.hide();
            $scope.showMessage("Error", "Ha courrido un error al enviar la solicitud.");
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