angular.module('lufke').controller('EditFiltersController', function(lodash, $scope, $ionicPopup, $http) {
    console.log('Inicia ... EditFiltersController');
    $http.post(api.filters.getTopInterests).success(function(data, status, headers, config) {
        $scope.model = data;
        console.dir(data);
    }).error(function(err, status, headers, config) {
        console.dir(err);
        console.log(status);
        $scope.showMessage("Error", "Ha ocurrido un error al cargar los filtros y preferencias.");
    });
    $scope.updateEditFilters = function() {
        $http.post(api.filters.getTopInterests).success(function(data, status, headers, config) {
            $scope.model = data;
            $scope.$broadcast('scroll.refreshComplete');
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar los filtros y preferencias.");
        });
    };
    $scope.optionDeleteClick = function(item) {
        $scope.model.shouldShowDelete = !$scope.model.shouldShowDelete;
        $scope.model.shouldShowReorder = false;
    };
    $scope.optionReorderClick = function(item) {
        $scope.model.shouldShowDelete = false;
        $scope.model.shouldShowReorder = !$scope.model.shouldShowReorder;
    };
    $scope.editInterests = function(item) {
        $http.post(api.filters.editTopInterests, $scope.model).success(function(data, status, headers, config) {
            $scope.model = data;
            $scope.showMessage("Exito", "Sus preferencias se guardaron exitosamente.");
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al guardar los filtros y preferencias.");
        });
    };
    $scope.addItem = function(item) {
        if ($scope.model.topInterests.length >= $scope.model.max) {
            $scope.showMessage("Alerta", "El ranking de intereses está completo, debe quitar alguno para ingresar el actual.");
        } else {
            $scope.model.interests.splice($scope.model.interests.indexOf(item), 1);
            item.interestRanking = 999;
            $scope.model.topInterests.push(item); //inserta al final
            $scope.orderTop();
        }
    };
    $scope.orderTop = function() {
        var percentages = [];
        switch ($scope.model.topInterests.length) {
            case 1:
                percentages = $scope.model.percentagesTop1;
                break;
            case 2:
                percentages = $scope.model.percentagesTop2;
                break;
            case 3:
                percentages = $scope.model.percentagesTop3;
                break;
            case 4:
                percentages = $scope.model.percentagesTop4;
                break;
        }
        if (percentages.length > 0) {
            $scope.model.topInterests = lodash.sortBy($scope.model.topInterests, function(i) {
                return i.interestRanking;
            });
            lodash.forEach($scope.model.topInterests, function(i, index) {
                i.interestRanking = index + 1;
                i.interestPercentage = percentages[index];
            });
        }
    };
    $scope.reorderItem = function(item, fromIndex, toIndex) {
        //solo reordena los top
        item.interestRanking = toIndex + (fromIndex > toIndex ? 0.5 : 1.5);
        $scope.orderTop();
    };
    $scope.removeItem = function(item) {
        $scope.model.topInterests.splice($scope.model.topInterests.indexOf(item), 1);
        item.interestRanking = 0;
        item.interestPercentage = 0;
        $scope.model.interests.push(item);
        if ($scope.model.topInterests.length <= 0) {
            $scope.model.shouldShowDelete = false;
            $scope.model.shouldShowReorder = false;
        } else {
            $scope.orderTop();
        }
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