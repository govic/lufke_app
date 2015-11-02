angular.module('lufke').config(function($stateProvider) {
    $stateProvider.state('tab.post', {
        cache: true,
        controller: 'PostController',
        templateUrl: 'app/templates/post_detail.html',
        url: '/post/:postId'
    });
});
