angular.module('lufke').config(function ($stateProvider) {
	$stateProvider.state('tab.NewsSearch', {
		cache: false,
		url: '/news-search',
		templateUrl: 'app/templates/news-search.html',
		controller: 'NewsSearch'
	});
});
