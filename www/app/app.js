angular.module('lufke', ['ionic', 'ngStorage', 'ngLodash', 'angularMoment', 'base64', 'ngCordova']).config(function($urlRouterProvider, $ionicConfigProvider) {
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
}).factory('profileService', function($localStorage, $state) {
    return {
        viewprofile: function(id) {
            if ($localStorage.session === id) {
                $state.go('tab.profile');
            } else {
                $state.go('publicprofile', {
                    profileId: id
                });
            }
        }
    }
}).config(['$httpProvider',
    function($httpProvider) {
        //Http Intercpetor to check auth failures for xhr requests
        $httpProvider.interceptors.push('authHttpResponseInterceptor');
    }
]).constant('$ionicLoadingConfig', {
    template: '<i class="icon ion-loading-c"></i>',
    animation: 'fade-in'
}).run(function($ionicPlatform, $rootScope, $http/*, $cordovaLocalNotification*/) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
    });
    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
        switch (notification.event) {
            case 'registered':
                console.log("$rootScope.$on('$cordovaPush:notificationReceived') .. registered");
                if (notification.regid.length > 0) {
                    $http.post(api.user.setRegistrationKey, {
                        registrationKey: notification.regid
                    }).success(function(user, status, headers, config) {
                        console.log("setRegistrationKey .. OK");
                    }).error(function(err, status, headers, config) {
                        console.log("setRegistrationKey .. ERROR");
                        console.dir(err);
                        console.log(status);
                    });
                }
                break;
            case 'message':
                console.log("$rootScope.$on('$cordovaPush:notificationReceived') .. message");
                // this is the actual push notification. its format depends on the data model from the push server
                console.log('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
                alert(notification.message);
                $cordovaLocalNotification.schedule({
                    id: 987654987,
                    title: 'Lufke',
                    text: notification.message
                });
                console.log("$cordovaLocalNotification.schedule .. PASO ...");
                break;
            case 'error':
                console.log("$rootScope.$on('$cordovaPush:notificationReceived') .. error");
                console.log('GCM error = ' + notification.msg);
                break;
            default:
                console.log("$rootScope.$on('$cordovaPush:notificationReceived') .. default");
                console.log('An unknown GCM event has occurred');
                break;
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