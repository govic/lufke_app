angular.module('lufke')
		.config(function ($stateProvider) {
			$stateProvider
					.state('menu-profile', {
						cache: true,
						url: '/menu-profile',
						templateUrl: 'app/templates/menu-profile.html',
						controller: 'MenuProfileController'
					});
		});
