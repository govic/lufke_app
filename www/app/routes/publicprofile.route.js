angular.module('lufke').config(function($stateProvider) {
    $stateProvider.state('publicprofile', {
        url: '/publicprofile/:profileId',
        templateUrl: 'app/templates/public_profile.html',
        controller: 'PublicProfileController'
    });
});