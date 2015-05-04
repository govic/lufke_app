angular.module('lufke').config(function ($stateProvider) {
	$stateProvider.state('post', {
		url: '/post/:postId',
		templateUrl: 'app/templates/post-detail.html',
		controller: 'PostController'
	});
});