angular.module('lufke')
		.config(function ($stateProvider) {
			$stateProvider
					.state('menu-profile', {
						cache: false,
						url: '/menu-profile',
						templateUrl: 'app/templates/menu-profile.html',
						controller: 'MenuProfileController'
					});
		});
