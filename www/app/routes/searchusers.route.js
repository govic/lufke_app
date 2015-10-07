angular.module('lufke').config(function ($stateProvider) {
	$stateProvider.state('searchusers', {
		url: '/searchusers',
		templateUrl: 'app/templates/search_users.html',
		controller: 'SearchUsersController'
	});
});
