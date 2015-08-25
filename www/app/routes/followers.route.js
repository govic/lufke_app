angular.module('lufke').config(function($stateProvider) {
    $stateProvider.state("followers", {
        url: "/user/:userid/followers",
        templateUrl: "app/templates/followers.html",
        controller: "FollowersController"
    });
});