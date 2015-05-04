angular.module('lufke')
		.config(function ($stateProvider) {
			$stateProvider
					.state('register', {
						url: '/register',
						templateUrl: 'app/templates/register.html',
						controller: 'RegisterController'
					});
		});