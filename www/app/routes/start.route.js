angular.module('lufke').config(function ($stateProvider) {
	$stateProvider.state('start', {
		cache: false,
		controller: 'StartController',
		templateUrl: 'app/templates/start.html',
		url: '/start'
	});
});
