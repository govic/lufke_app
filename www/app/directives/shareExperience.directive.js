angular.module('lufke')
		.directive('shareExperience', function () {
			return {
				restrict: 'E',
				scope: { cssClass: "@" },
				templateUrl: 'app/templates/directives/share-experience.html'
			};
		});
