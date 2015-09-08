angular
.module('lufke')
.directive('dnaInterests', function ($state, $rootScope) {
	return {
		scope: { interests: "=", readOnly: "=" },
		controller: function($scope, $element, $attrs){

            $scope.toDna = function(){
                if($scope.readOnly === false){
                    $state.go('dna');
                }
            }
			var $interestsModified = $rootScope.$on("interestsModified", function(){
				UpdateInterests();
			});
			var $destroy = $scope.$on("$destroy", function(){
				$destroy()
				$interestsModified();
			});

			$scope.odd = [];
			$scope.even = [];

			$scope.$watch("interests", UpdateInterests)

			$scope.adn = url_adn;

			function UpdateInterests(){
				$scope.odd = [];
				$scope.even = [];

				if($scope.interests && $scope.interests.constructor === Array){

					$scope.widthDna = ((parseInt($scope.interests.length) / 2 + 2) * 10).toString() + "em" || "125em";

					$scope.interests.forEach(function(interest, index){
						if(index % 2 === 0){
							$scope.odd.push(interest);
						}
						else{
							$scope.even.push(interest);
						}
					});

				}else{
					$scope.widthDna = "125em";
				}
			}
		},
		restrict: 'E',
		templateUrl: 'app/templates/directives/dna-interests.html'
	};
});
