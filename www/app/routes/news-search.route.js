angular.module('lufke').config(function ($stateProvider) {
	$stateProvider.state('NewsSearch', {
		cache: true,
		url: '/news-search',
		templateUrl: 'app/templates/news-search.html',
		controller: 'NewsSearch'
	});
});
