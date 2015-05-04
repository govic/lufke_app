angular.module('lufke').controller('FiltersController', function ($scope) {
	console.log('Inicia ... FiltersController');
	$scope.model = {
		interests: [
			{
				interestId: 1,
				interestRanking: 1,
				interestName: "SKATEBOARDING",
				interestPercentage: 40
			}, {
				interestId: 2,
				interestRanking: 2,
				interestName: "SURFING",
				interestPercentage: 30
			}, {
				interestId: 3,
				interestRanking: 3,
				interestName: "TRAVELLING",
				interestPercentage: 20
			}, {
				interestId: 4,
				interestRanking: 4,
				interestName: "FOOTBALL",
				interestPercentage: 10
			}
		],
		proportions: {
			percentagePhotos: 50,
			percentageVideos: 25,
			percentageLinks: 25
		},
		distance: 100,
		distanceUnit: "KM"
	};

	$scope.editInterests = function () {
		alert("Editar intereses!")
	};
});