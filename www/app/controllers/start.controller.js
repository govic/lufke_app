angular.module('lufke').controller('StartController', function ($scope, $state, $timeout) {
	console.log('Inicia ... StartController');	
	//TODO borrar esto y hacerlo de forma correcta
	$timeout(function() {
       //will be directed to / after 3 seconds.
       $state.go('login');
    }, 2000);	
	return;
});