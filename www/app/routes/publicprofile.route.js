angular.module('lufke').config(function($stateProvider) {
    $stateProvider.state('publicprofile', {
        cache: false,
        url: '/publicprofile/:profileId',
        templateUrl: 'app/templates/public_profile.html',
        controller: 'PublicProfileController'
    });
});