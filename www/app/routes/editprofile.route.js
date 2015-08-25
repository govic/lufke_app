angular.module('lufke').config(function ($stateProvider) {
	$stateProvider.state('editprofile', {
        cache: false,
		url: '/editprofile/:id',
		templateUrl: 'app/templates/edit_profile.html',
		controller: 'EditProfileController'
	});
});