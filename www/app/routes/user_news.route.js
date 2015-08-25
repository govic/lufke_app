angular.module('lufke')
		.config(function ($stateProvider) {
			$stateProvider.state('usernews', {
                url: '/user/:userId/news',
                templateUrl: 'app/templates/user_news.html',
                controller: "UserNewsController"
            });
        });
