angular.module('lufke', ['ionic', 'ngStorage', 'ngLodash', 'angularMoment', 'base64']).config(function($urlRouterProvider, $ionicConfigProvider) {
    $urlRouterProvider.otherwise('/start');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
}).run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

moment.locale('es', {
    relativeTime: {
        future: 'en %s',
        past: '%s',
        s: 'ahora',
        m: '1 minuto',
        mm: '%d minutos',
        h: '1 hora',
        hh: '%d horas',
        d: '1 día',
        dd: '%d días',
        M: '1 mes',
        MM: '%d meses',
        y: '1 año',
        yy: '%d años'
    }
});