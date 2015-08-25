angular.module('lufke').config(function($stateProvider) {
    $stateProvider.state("following", {
        url: "/user/:userid/following",
        templateUrl: "app/templates/following.html",
        controller: "FollowingController"
    });
});