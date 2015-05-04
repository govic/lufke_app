angular.module('lufke')
		.config(function ($stateProvider) {
			$stateProvider
					.state('tab', {
						url: '/tab',
						abstract: true,
						templateUrl: 'app/templates/tabs.html'
					})
					.state('tab.news', {
						url: '/news',
						templateUrl: 'app/templates/news.html',
						controller: 'NewsController'
					})
					.state('tab.explore', {
						url: '/explore',
						templateUrl: 'app/templates/explore.html',
						controller: 'ExploreController'
					})
					.state('tab.notifications', {
						url: '/notifications',
						templateUrl: 'app/templates/notifications.html',
						controller: 'NotificationsController'
					})
					.state('tab.profile', {
						url: '/profile',
						templateUrl: 'app/templates/profile.html',
						controller: 'ProfileController'
					})
					;
		});