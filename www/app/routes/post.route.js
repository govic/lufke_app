angular.module('lufke').config(function($stateProvider) {
    $stateProvider.state('tab.post', {
        url: '/post/:postId',
        templateUrl: 'app/templates/post_detail.html',
        controller: 'PostController'
    });
});
