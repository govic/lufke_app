angular.module('lufke').config(function($stateProvider) {
    $stateProvider.state('dna', {
        url: '/dna',
        templateUrl: 'app/templates/dna.html',
        controller: 'DnaController'
    });
});