angular.module('lufke').controller('FiltersController', function($scope, $ionicPopup, $http, $state) {
    console.log('Inicia ... FiltersController');
    $http.post(api.filters.getFilters).success(function(data, status, headers, config) {
        $scope.model = data;
    }).error(function(err, status, headers, config) {
        console.dir(err);
        console.log(status);
        $scope.showMessage("Error", "Ha ocurrido un error al cargar los filtros y preferencias.");
    });
    $scope.updateFiltersData = function() {
        $http.post(api.filters.getFilters).success(function(data, status, headers, config) {
            $scope.model = data;
            $scope.$broadcast('scroll.refreshComplete');
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar los filtros y preferencias.");
        });
    };
    $scope.saveFilters = function() {
        $http.post(api.filters.saveFilters, $scope.model).success(function(data, status, headers, config) {
            $scope.model = data;
            $scope.showMessage("Exito", "Sus preferencias fueron guardadas exitosamente.");
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al guardar los filtros y preferencias.");
        });
    };
    $scope.editInterests = function() {
        $state.go('editfilters');
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