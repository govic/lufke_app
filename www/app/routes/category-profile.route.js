angular.module('lufke').config(function($stateProvider) {
    $stateProvider.state("category-profile", {
        cache: false,
        controller: "CategoryProfileController",
        url: "/category/:category",
        templateUrl: "app/templates/category-profile.html"
    });
});
