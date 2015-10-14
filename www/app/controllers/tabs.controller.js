angular
.module('lufke')
.controller("TabsCtrl", function($state, $ionicHistory, $scope){
	$scope.Go = function _Go(state){
		if(state !== $ionicHistory.currentStateName()){
			$state.go(state);
		}
	}
});
