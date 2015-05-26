angular.module('lufke').config(function($stateProvider) {
    $stateProvider.state('allnotifications', {
        url: '/allnotifications',
        templateUrl: 'app/templates/all_notifications.html',
        controller: 'AllNotificationsController'
    });
});