angular.module('lufke')
		.directive('postSummary', function () {
			return {
				restrict: 'E',
				templateUrl: 'app/templates/directives/post-summary.html'
			};
		});