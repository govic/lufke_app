angular.module('lufke')
		.config(function ($stateProvider) {
			$stateProvider.state('tab.usernews', {
				cache: true,
				controller: "UserNewsController",
                templateUrl: 'app/templates/user_news.html',
				url: '/user/:userId/news'
            });
        });
