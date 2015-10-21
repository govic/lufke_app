angular.module('lufke').config(function($stateProvider) {
    $stateProvider
        .state('SearchInterest', {
            cache: false,
            controller: 'SearchInterestController',
            controllerAs: "siCtrl",
            templateUrl: 'app/templates/newpost-search.html',
            url: '/search-interest/:profileid'
        }).state('SearchUser', {
            cache: false,
            controller: 'SearchUserController',
            controllerAs: "suCtrl",
            templateUrl: 'app/templates/newpost-search.html',
            url: '/search-user/:profileid'
        });
});
