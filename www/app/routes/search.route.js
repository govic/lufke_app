angular.module('lufke').config(function($stateProvider) {
    $stateProvider
        .state('SearchInterest', {
            cache: true,
            controller: 'SearchInterestController',
            controllerAs: "siCtrl",
            templateUrl: 'app/templates/search.html',
            url: '/search-interest/:profileid'
        }).state('SearchUser', {
            cache: true,
            controller: 'SearchUserController',
            controllerAs: "suCtrl",
            templateUrl: 'app/templates/search.html',
            url: '/search-user/:profileid'
        });
});
