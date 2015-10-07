angular.module('lufke').controller('DnaController', function($rootScope, $ionicLoading, lodash, $scope, $ionicPopup, $http, $state, UserInterestsSrv) {
    console.log('Inicia ... DnaController');

    $scope.remove = function(item) {
        var promise = UserInterestsSrv.remove(item); //la promise no la utilizamos en este caso, actualizamos de inmediato.

        UserInterestsSrv.get().then(function(data){
            $scope.interests = data;
            $rootScope.$emit("interest-removed");
        }, function(err){
            $scope.showMessage("Error", "Ha ocurrido un error al cargar la lista de intereses.");
        });
    };
    $scope.back = function(){
        $state.go("tab.profile");
        $rootScope.$emit("interestsModified");
    }

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

    var $stateChangeSuccess = $scope.$on('$stateChangeSuccess', function() {
        $scope.load();
    });
    var $destroy = $scope.$on("$destroy", function(){
        $stateChangeSuccess();
        $destroy();
    })

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
