angular.module('lufke')
		.config(function ($stateProvider) {
			$stateProvider.state('filters', {
				cache: false,
				controller: 'FiltersController',
				templateUrl: 'app/templates/filters.html',
				url: '/filters'
			});
		});
