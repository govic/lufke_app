angular.module('lufke', ['ionic', 'ngStorage', 'ngLodash', 'angularMoment', 'base64']).config(function($urlRouterProvider, $ionicConfigProvider) {
    $urlRouterProvider.otherwise('/start');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
}).factory('authHttpResponseInterceptor', function($q, $location, $localStorage) {
    return {
        response: function(response) {
            if (response.status === 401) {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                console.log("Response Error 401", rejection);
                $localStorage.basic = null;
                $localStorage.session = null;
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
    }
}).config(['$httpProvider',
    function($httpProvider) {
        //Http Intercpetor to check auth failures for xhr requests
        $httpProvider.interceptors.push('authHttpResponseInterceptor');
    }
]).run(function($ionicPlatform) {
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
}).directive('noCacheSrc', function($window) {
  return {
    priority: 99,
    link: function(scope, element, attrs) {
      attrs.$observe('noCacheSrc', function(noCacheSrc) {
        noCacheSrc += '?' + (new Date()).getTime();
        attrs.$set('src', noCacheSrc);
      });
    }
  }
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