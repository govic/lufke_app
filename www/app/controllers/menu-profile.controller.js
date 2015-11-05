angular
.module("lufke")
.controller("MenuProfileController", function($cordovaInAppBrowser, $localStorage, $state, $scope, $rootScope, $http, ShowMessageSrv){

    $scope.showMessage = ShowMessageSrv;
    $scope.model = {
        public: $localStorage.public == true
    }

    $scope.togglePrivacity = function(){
        $scope.model.public = !$scope.model.public;
        $localStorage.public = $scope.model.public;

        $http.post(api.user.editPrivacity, {
            profileId: $localStorage.session,
            publicProfile: $scope.model.public
        }).error(function(){
            $localStorage.public = !$scope.model.public;
            $scope.showMessage("Error", "No fue posible actualizar la privacidad.");
        });
    }

    $scope.editPassEnabled = $localStorage["login-data"] === null || typeof $localStorage["login-data"] === "undefined";

    $scope.privacidadLink = function(){
        $cordovaInAppBrowser.open("http://lufke.com/privacy.html", "_system");
    }
    $scope.terminosLink = function(){
        $cordovaInAppBrowser.open("http://lufke.com/terms.html", "_system");
    }
    $scope.logout = function() {
        $rootScope.$emit("logout");
        $state.go('login');
    };
});
