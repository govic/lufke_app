angular
.module("lufke")
.controller("MenuProfileController", function($cordovaInAppBrowser, $localStorage, $state, $scope, $rootScope){

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
