angular.module('lufke').config(function ($stateProvider) {
	$stateProvider.state('start', {
		url: '/start',
		templateUrl: 'app/templates/start.html',
		controller: 'StartController'
	});
});