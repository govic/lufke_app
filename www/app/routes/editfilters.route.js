angular.module('lufke').config(function ($stateProvider) {
	$stateProvider.state('editfilters', {
		url: '/editfilters',
		templateUrl: 'app/templates/edit_filters.html',
		controller: 'EditFiltersController'
	});
});