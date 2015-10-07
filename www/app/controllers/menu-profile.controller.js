angular
.module("lufke")
.controller("MenuProfileController", function($localStorage, $state, $scope){
    $scope.logout = function() {
		console.log("logout event")
        $localStorage.basic = null;
        $localStorage.session = null;
		$localStorage["login-data"] = null;
        $state.go('login');
    };
});
