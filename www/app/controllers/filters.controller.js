angular.module('lufke').controller('FiltersController', function($ionicHistory, $ionicLoading, $scope, $ionicPopup, $http, $state, ShowMessageSrv) {
    console.log('Inicia ... FiltersController');
    $ionicLoading.show();
    $scope.cancel = function(){
        $ionicHistory.goBack();
    }
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
    $scope.showMessage = ShowMessageSrv;
    $http.post(api.filters.getFilters).success(function(data, status, headers, config) {
        $scope.model = data;
         $ionicLoading.hide();
    }).error(function(err, status, headers, config) {
        console.dir(err);
        console.log(status);
        $ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error al cargar los filtros y preferencias.");
    });
});
