angular.module('lufke').controller('DnaController', function($ionicLoading, lodash, $scope, $ionicPopup, $http, UserInterestsSrv) {
    console.log('Inicia ... DnaController');
    
    $scope.updateData = function() {
        
        var promise = UserInterestsSrv.get();
        
        promise.then(function(data){
            $scope.interests = data;
            $scope.$broadcast('scroll.refreshComplete');
        },function(err){
            console.dir(err);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar la lista de intereses.");
        });
    };
    $scope.remove = function(item) {
        var promise = UserInterestsSrv.remove(item); //la promise no la utilizamos en este caso, actualizamos de inmediato.
        
        UserInterestsSrv.get().then(function(data){
            $scope.interests = data;
        }, function(err){
            $scope.showMessage("Error", "Ha ocurrido un error al cargar la lista de intereses.");
        });
    };
    
    $scope.more = true;
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
    $scope.load = function() {
        $scope.more = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    $scope.$on('$stateChangeSuccess', function() {
        $scope.load();
    });

    $ionicLoading.show();
    var promise = UserInterestsSrv.get();

    promise.then(function(data){
        $scope.interests = data;
        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.hide();
    },function(err){
        console.dir(err);
        $ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error al cargar la lista de intereses.");
    });
});