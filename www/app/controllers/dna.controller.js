angular.module('lufke').controller('DnaController', function($ionicLoading, lodash, $scope, $ionicPopup, $http) {
    console.log('Inicia ... DnaController');
    $ionicLoading.show();
    $http.post(api.user.getInterests).success(function(data, status, headers, config) {
        $scope.model = data;
        $ionicLoading.hide();
        console.dir(data);
    }).error(function(err, status, headers, config) {
        console.dir(err);
        console.log(status);
        $ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error al cargar la lista de intereses del usuario.");
    });
    $scope.updateData = function() {
        $http.post(api.user.getInterests).success(function(data, status, headers, config) {
            $scope.model = data;
            console.dir(data);
            $scope.$broadcast('scroll.refreshComplete');
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar la lista de intereses del usuario.");
        });
    };
    $scope.removeItem = function(item) {
        $ionicPopup.confirm({
            title: 'Eliminar',
            template: '¿Está seguro de querer eliminar este elemento?',
            okText: 'Eliminar',
            cancelText: 'Cancelar'
        }).then(function(res) {
            if (res) {
            	console.dir(item);
                $http.post(api.user.deleteInterest, {
                	interestId: item.interestId
                }).success(function(data, status, headers, config) {
                    $scope.model = data;
                }).error(function(err, status, headers, config) {
                    console.dir(err);
                    console.log(status);
                    $scope.showMessage("Error", "Ha ocurrido un error al eliminar el elemento.");
                });
            }
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