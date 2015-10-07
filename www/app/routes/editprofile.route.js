angular.module('lufke').config(function ($stateProvider) {
	$stateProvider.state('editprofile', {
        cache: false,
		url: '/editprofile/:id',
		templateUrl: 'app/templates/edit_profile.html',
		controller: 'EditProfileController'
	})
	.state("editpass", {
		cache: false,
		url: '/editpass/:id',
		templateUrl: 'app/templates/edit_pass.html',
		controller: 'EditPassController'
	});
});
