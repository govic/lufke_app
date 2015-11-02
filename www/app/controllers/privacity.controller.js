angular
.module("lufke")
.controller("PrivacityCtrl", function($ionicHistory, $scope, $http, $localStorage, ShowMessageSrv){
    $scope.showMessage = ShowMessageSrv;
    $scope.model = {
        public: ($localStorage.public == true).toString()
    }

    $scope.cancel = function(){
        $ionicHistory.goBack();
    }
    $scope.save = function(){
        var _public = $localStorage.public;
        $localStorage.public = $scope.model.public == 'true';
        $http.post(api.user.editPrivacity, {
            profileId: $localStorage.session,
            publicProfile: $scope.model.public == 'true'
        }).error(function(){
            $localStorage.public = _public;
            $scope.showMessage("Error", "No fue posible actualizar la privacidad.");
        });
        $ionicHistory.goBack();
    }
})
