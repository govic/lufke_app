angular.module('lufke').config(function($stateProvider) {
    $stateProvider.state("tab.followers", {
        controller: "FollowersController",
        templateUrl: "app/templates/followers.html",
        url: "/user/:userid/followers"
    });
});
