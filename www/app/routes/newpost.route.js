angular.module('lufke').config(function ($stateProvider) {
	$stateProvider.state('newpost', {
		cache: true,
		url: '/newpost?next',
		templateUrl: 'app/templates/new_post.html',
		controller: 'NewPostController'
	});
});
