angular
.module("lufke")
.controller("MenuProfileController", function($localStorage, $state, $scope){

    $scope.editPassEnabled = $localStorage["login-data"] === null || typeof $localStorage["login-data"] === "undefined";

    $scope.logout = function() {
		console.log("logout event")
        $localStorage.basic = null;
        $localStorage.session = null;
		delete $localStorage["login-data"];
        $state.go('login');
    };
});
