angular.module('lufke').controller('EditDnaController', function(lodash, $scope, $ionicPopup, $http, UserInterestsSrv) {
    console.log('Inicia ... EditDnaController');
    $scope.model = {};
    $scope.model.searchText = "";
    $http.post(api.user.getSuggestedInterests).success(function(data, status, headers, config) {
        $scope.model = data;
    }).error(function(err, status, headers, config) {
        console.dir(err);
        console.log(status);
        $scope.showMessage("Error", "Ha ocurrido un error al cargar la lista de intereses del usuario.");
    });
    $scope.updateData = function() {
        $scope.model.searchText = "";
        $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.search = function() {
        $http.post(api.user.searchInterests, {
            searchText: $scope.model.searchText
        }).success(function(data, status, headers, config) {
            $scope.model = data;
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar la lista de intereses del usuario.");
        });
    };
    $scope.add = function(item) {
        var promise = UserInterestsSrv.add(item);
        var index = $scope.model.interests.indexOf(item);
        
        $scope.model.interests.splice(index, 1);
        
        promise.then(function(data){
            
        }, function(err){
            self.model.interests.splice( index, 0, item );
        });
        
        /*
        $http.post(api.user.addInterestToProfile, {
            interestId: item.interestId
        }).success(function(data, status, headers, config) {
            $scope.model.interests.splice($scope.model.interests.indexOf(item), 1);
            $scope.showMessage("Exito", "El interés seleccionado ha sido agregado a su perfil.");
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al agregar el interés seleccionado a su perfil.");
        });
        */
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