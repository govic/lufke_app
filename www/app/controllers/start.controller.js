angular.module('lufke').controller('StartController', function ($scope, $state) {
	console.log('Inicia ... StartController');
	$state.go('login');
	return;
});