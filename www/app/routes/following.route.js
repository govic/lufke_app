angular.module('lufke').config(function($stateProvider) {
    $stateProvider.state("tab.following", {
        controller: "FollowingController",
        templateUrl: "app/templates/following.html",
        url: "/user/:userid/following"
    });
});
