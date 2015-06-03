angular.module('lufke').controller('LoginController', function($rootScope, $cordovaPush, $localStorage, $http, $scope, $state, $ionicHistory, $ionicPopup, $base64, $ionicLoading) {
    console.log('Inicia ... LoginController');
    $scope.url = url_files;
    $scope.loginImage = 'assets/img/login.png';
    //verificacion de datos estaticos de autenticacion
    $ionicLoading.show();
    if ($localStorage.basic && $localStorage.basic.trim() != "") {
        $http.post(api.user.login, {
            credentialsHash: $localStorage.basic.split(" ")[1]
        }).success(function(user, status, headers, config) {
            var auth = 'Basic ' + user.credentialsHash;
            $http.defaults.headers.common.Authorization = auth; //cabecera auth por defecto
            $localStorage.basic = auth; //guarda cabecera auth en var global localstorage
            $localStorage.session = user.id; //guarda id usuario para consultas - global localstorage
            $scope.model.loginError = false;
            $ionicLoading.hide();
            $state.go('tab.news'); //redirige hacia news
            return;
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $ionicLoading.hide();
        });
    } else {
        $ionicLoading.hide();
    }
    $ionicHistory.clearCache();
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $http.defaults.headers.common.Authorization = null;
    $localStorage.basic = null;
    $localStorage.session = null;
    $scope.model = {
        user: {
            name: "",
            password: ""
        },
        recoveryData: {
            emailError: false,
            email: ""
        },
        foto: ""
    };
    $rootScope.$on('logout', function(event, args) {
        $ionicHistory.clearCache();
        $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        $http.defaults.headers.common.Authorization = null;
        $localStorage.basic = null;
        $localStorage.session = null;
        $scope.model = {
            user: {
                name: "",
                password: ""
            },
            recoveryData: {
                emailError: false,
                email: ""
            },
            foto: ""
        };
    });
    $scope.showMessage = function(title, message, callback) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message,
            okText: "Aceptar"
        });
        alertPopup.then(function(res) {
            if (callback) callback();
            return;
        });
    };
    $scope.showRememberPassword = function() {
        var popupRemember = $ionicPopup.show({
            template: ' <input ng-model="model.recoveryData.email" placeholder="correo@ejemplo.com" required>\n\
                        <div class="padding assertive" ng-show="model.recoveryData.emailError">\n\
                        <i class="icon ion-alert-circled"></i>\n\
                        Ingrese un correo electrónico correcto\n\
                        </div>',
            title: 'Ingrese su correo electrónico',
            scope: $scope,
            buttons: [{
                text: 'Cancel'
            }, {
                text: '<b>Enviar</b>',
                type: 'button-positive',
                attr: 'ng-disabled="!model.recoveryData.email"',
                onTap: function(e) {
                    $scope.recoverPassword(e);
                }
            }]
        });
        popupRemember.then(function(res) {
            console.log('Tapped!', res);
        });
    };
    $scope.recoverPassword = function(e) {
        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!$scope.model.recoveryData.email || !emailRegex.test($scope.model.recoveryData.email)) {
            $scope.model.recoveryData.emailError = true;
            e.preventDefault();
        } else {
            $scope.showMessage("Correo enviado", "Se ha enviado un correo con su contraseña.");
        }
    };
    $scope.validateUser = function() {
        console.log('LoginController ... validateUser');
        $ionicLoading.show();
        if ($scope.model.user.email !== "" && $scope.model.user.password !== "") {
            var userModel = new User({
                credentialsHash: $base64.encode(unescape(encodeURIComponent($scope.model.user.name + ":" + $scope.model.user.password)))
            });
            $http.post(api.user.login, userModel).success(function(user, status, headers, config) {
                var auth = 'Basic ' + user.credentialsHash;
                $http.defaults.headers.common.Authorization = auth; //cabecera auth por defecto
                $localStorage.basic = auth; //guarda cabecera auth en var global localstorage
                $localStorage.session = user.id; //guarda id usuario para consultas - global localstorage
                /* ****************************** */
                /*       Notificaciones push      */
                /* ****************************** */
                var androidConfig = {
                    "senderID": "767122101153"
                };
                $cordovaPush.register(androidConfig);
                $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
                    switch (notification.event) {
                        case 'registered':
                            console.log("$rootScope.$on('$cordovaPush:notificationReceived') .. registered");
                            if (notification.regid.length > 0) {
                                console.log('registration ID = ' + notification.regid);
                            }
                            break;
                        case 'message':
                            console.log("$rootScope.$on('$cordovaPush:notificationReceived') .. message");
                            // this is the actual push notification. its format depends on the data model from the push server
                            console.log('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
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
                /*
                // WARNING: dangerous to unregister (results in loss of tokenID)
                $cordovaPush.unregister(options).then(function(result) {
                    // Success!
                }, function(err) {
                    // Error
                })
                */
                $ionicLoading.hide();
                $state.go('tab.news'); //redirige hacia news
                return;
            }).error(function(err, status, headers, config) {
                console.dir(err);
                console.log(status);
                $http.defaults.headers.common.Authorization = null;
                $localStorage.session = null;
                $localStorage.basic = null;
                $scope.model.user.password = "";
                $ionicLoading.hide();
                if (status == 500) $scope.showMessage("Error", "El nombre de usuario o la contraseña no son correctos.");
                else $scope.showMessage("Error", "No es posible contactar con el servidor en estos momentos, por favor intente más tarde.");
            });
        } else {
            $localStorage.session = null;
            $scope.model.user.password = "";
            $ionicLoading.hide();
        }
    };
});