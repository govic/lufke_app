angular
.module('lufke')
.directive('dnaInterests', function ($state) {
	return {
		scope: { interests: "=", readOnly: "=" },
		link: function($scope, $element, $attrs){
            
            $scope.toDna = function(){
                if($scope.readOnly === false){
                    $state.go('dna');
                }
            }
			
			$scope.odd = [];
			$scope.even = [];
			
			$scope.$watch("interests", function(newValue, oldValue){
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
			})
			
			$scope.adn = url_adn;
		},
		restrict: 'E',
		templateUrl: 'app/templates/directives/dna-interests.html'
	};
});