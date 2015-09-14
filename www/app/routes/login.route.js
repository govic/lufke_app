angular.module('lufke').config(function ($stateProvider) {
	$stateProvider.state('login', {
		cache: false,
		controller: 'LoginController',
		templateUrl: 'app/templates/login.html',
		url: '/login'
	});
});
