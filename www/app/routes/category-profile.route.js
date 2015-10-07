angular.module('lufke').config(function($stateProvider) {
    $stateProvider.state("category-profile", {
        cache: true,
        controller: "CategoryProfileController",
        url: "/category/:id?:name",
        templateUrl: "app/templates/category-profile.html"
    })
    .state("search-user-category",{
        cache: true,
        controller: "SearchCategoryUser",
        url: "/category/:id/search-user",
        templateUrl: "app/templates/search_users.html"
    });
});
