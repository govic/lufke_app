angular.module('lufke').config(function ($stateProvider) {
	$stateProvider.state('newpost', {
		url: '/newpost',
		templateUrl: 'app/templates/new_post.html',
		controller: 'NewPostController'
	});
});