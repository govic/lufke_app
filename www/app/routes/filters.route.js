angular.module('lufke')
		.config(function ($stateProvider) {
			$stateProvider
					.state('filters', {
						url: '/filters',
						templateUrl: 'app/templates/filters.html',
						controller: 'FiltersController'
					});
		});