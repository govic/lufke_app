angular.module('lufke', ['ionic', 'ngStorage', 'ngLodash', 'angularMoment', 'base64', 'ngCordova', 'ngAnimate']).config(function($urlRouterProvider, $ionicConfigProvider) {
    $urlRouterProvider.otherwise('/start');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
}).factory('authHttpResponseInterceptor', function($q, $location, $localStorage) {
    return {
        request: function(config){
            config.headers["Authorization"] = $localStorage.basic;
            config.headers['Access-Control-Allow-Origin'] = '*';
            return config;
        },
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
                $localStorage.public = null;
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
                $state.go('tab.publicprofile', {
                    profileId: id
                });
            }
        }
    }
}).config(['$httpProvider', function($httpProvider) {
        //Http Intercpetor to check auth failures for xhr requests
        $httpProvider.interceptors.push('authHttpResponseInterceptor');
    }
]).constant('$ionicLoadingConfig', {
    template: '<i class="icon ion-loading-c"></i>',
    animation: 'fade-in',
    noBackdrop: false
}).run(function($ionicPlatform, $rootScope, $http, $cordovaDialogs, $state, $cordovaPush, $ionicHistory, $localStorage, FilterInterests) {
	$ionicPlatform.ready(function() {
		$ionicPlatform.onHardwareBackButton(function(e) {
			if("tab.news" === $ionicHistory.currentStateName()){
				e.preventDefault();
				e.stopPropagation();
                ionic.Platform.exitApp()

				return false;
			}
			return true;
		});

		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}

        $rootScope.$on("login", function(){
            if (ionic.Platform.platform() != "win32") {
                try{
                    $cordovaPush.register({ "senderID": "767122101153" });
                }catch(e){
                    console.log(e)
                }
    		}
        });
        $rootScope.$on("logout", function(){
            $ionicHistory.clearCache();
            $http.defaults.headers.common.Authorization = null;
            $localStorage.basic = null;
            $localStorage.session = null;
            $localStorage.public = null;
            $localStorage["login-data"] = null;
            FilterInterests.reset();
            if (ionic.Platform.platform() != "win32") {
                try{
        			$cordovaPush.unregister({ "senderID": "767122101153" });
                }catch(e){
                    console.log("unregister exception")
                    console.log(e)
                }
    		}
        });
    });
    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
        switch (notification.event) {
            case 'registered':
                if (notification.regid.length > 0) {
                    console.log("GCM registered = " + notification.regid);
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
                console.log('GCM message = ' + notification.message);
                //alert(notification.message);
                $cordovaDialogs.alert(notification.message, 'Notificación', 'Aceptar').then(function(){
                    $state.go('notification');
                });
                //navigator.notification.alert(notification.message);
                //console.dir(cordova.plugins);
                /*window.cordova.plugins.notification.local.schedule.add({
                    id: 417546,
                    title: 'Title here 7y987987',
                    text: 'Text here h987'
                });*/
                break;
            case 'error':
                console.log('GCM error = ' + notification.msg);
                break;
            default:
                console.log('An unknown GCM event has occurred');
                break;
        }
    });
})
moment.locale('es', {
    relativeTime: {
        future: '%s',
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
