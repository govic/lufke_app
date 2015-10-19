angular.module('lufke')
		.config(function ($stateProvider) {
			$stateProvider
					.state('menu-profile', {
						cache: true,
						url: '/menu-profile',
						templateUrl: 'app/templates/menu-profile.html',
						controller: 'MenuProfileController'
					})
					.state("privacity", {
						cache: false,
						controller: "PrivacityCtrl",
						templateUrl: "app/templates/privacity.html",
						url: "/privacity"
					});
		});
