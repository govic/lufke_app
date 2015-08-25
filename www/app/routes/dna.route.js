angular.module('lufke').config(function($stateProvider) {
    $stateProvider.state('dna', {
        cache: false,
        url: '/dna',
        templateUrl: 'app/templates/dna.html',
        controller: 'DnaController'
    });
});