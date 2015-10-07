angular.module('lufke').config(function($stateProvider) {
    $stateProvider
        .state('register', {
            cache: false,
            controller: 'RegisterController',
            templateUrl: 'app/templates/register.html',
            url: '/register'
        })
        .state("personal-info", {
            cache: false,
            controller: 'PersonalInfoController',
            templateUrl: 'app/templates/personal-info.html',
            url: '/register/personal-info'
        })
        .state("register-interest", {
            cache: false,
            controller: 'RegisterInterestController',
            templateUrl: 'app/templates/register-interest.html',
            url: '/register/register-interest'
        });
});
