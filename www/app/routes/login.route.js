angular.module('lufke').config(function ($stateProvider) {
	$stateProvider.state('login', {
		url: '/login',
		templateUrl: 'app/templates/login.html',
		controller: 'LoginController'
	});
});