angular.module('lufke').config(function ($stateProvider) {
	$stateProvider.state('editdna', {
		url: '/editdna',
		templateUrl: 'app/templates/edit_dna.html',
		controller: 'EditDnaController'
	});
});