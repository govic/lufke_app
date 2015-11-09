angular.module('lufke')
		.config(function ($stateProvider) {
			$stateProvider
					.state('tab', {
						abstract: true,
						controller: "TabsCtrl",
						templateUrl: 'app/templates/tabs.html',
						url: '/tab'
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
						cache: true,
						url: '/profile',
						templateUrl: 'app/templates/profile.html',
						controller: 'ProfileController'
					});
		});
