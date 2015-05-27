angular.module('lufke', ['ionic', 'ngStorage', 'ngLodash', 'angularMoment', 'base64', 'ngCordova']).config(function($urlRouterProvider, $ionicConfigProvider) {
    $urlRouterProvider.otherwise('/start');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
})
.factory('authHttpResponseInterceptor', function($q, $location, $localStorage) {
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
})
.factory('profileService', function($localStorage, $state){
    return{
        viewprofile: function(id){
            if($localStorage.session === id){
                $state.go('tab.profile');
            }
            else{
                $state.go('publicprofile', {profileId: id});
            }
        }
    }
})
.config(['$httpProvider',
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
})
moment.locale('es', {
    relativeTime: {
        future: 'en %s',
        past: '%s',
        s: 'ahora',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1M',
        MM: '%dM',
        y: '1a',
        yy: '%da'
    }
});