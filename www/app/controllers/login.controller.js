angular.module('lufke').controller('LoginController', function( $ionicHistory, $rootScope, $cordovaPush, $localStorage, $http, $scope, $state, $ionicHistory, $ionicPopup, $base64, $ionicLoading, UserInterestsSrv) {
    console.log('Inicia ... LoginController');

    UserInterestsSrv.reset();

    $scope.url = url_files;
    $scope.loginImage = 'assets/img/login.png';

    $ionicHistory.clearCache();
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    //verificacion de datos estaticos de autenticacion
    $ionicLoading.show();

    if ($localStorage.basic && $localStorage.basic.trim() != "") {
        $http.post(api.user.login, {
			credentialsHash: $localStorage.basic.split(" ")[1]
		}).success(function(user, status, headers, config) {
			var auth = 'Basic ' + user.credentialsHash;
			$localStorage.basic = auth; //guarda cabecera auth en var global localstorage
			$localStorage.session = user.id; //guarda id usuario para consultas - global localstorage
			$scope.model.loginError = false;
			/* if (ionic.Platform.platform() != "win32") {
				$cordovaPush.register({ "senderID": "767122101153" });
			} */
			$ionicLoading.hide();

            UserInterestsSrv.get();console.log("Init UserInterestsSrv")

            $rootScope.$emit("profile-updated");

			$state.go('tab.news'); //redirige hacia news
		}).error(function(err, status, headers, config) {
			console.dir(err);
			console.log(status);
			$ionicLoading.hide();
			$scope.showMessage("Error", "No es posible contactar con el servidor en estos momentos, por favor intente más tarde.");
		});

	} else {
		$ionicLoading.hide();
		$localStorage.basic = null;
		$localStorage.session = null;
	}

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
        console.log("logout event")
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
    $scope.goToRegister = function(){
        $ionicHistory.nextViewOptions({
              disableAnimate: true,
              disableBack: true
        });
        $state.go('register');
    };
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
            $http.post(api.user.login, {
                credentialsHash: $base64.encode(unescape(encodeURIComponent($scope.model.user.name + ":" + $scope.model.user.password)))
            }).success(function(user, status, headers, config) {

                var auth = 'Basic ' + user.credentialsHash;
                $http.defaults.headers.common.Authorization = auth; //cabecera auth por defecto
                $localStorage.basic = auth; //guarda cabecera auth en var global localstorage
                $localStorage.session = user.id; //guarda id usuario para consultas - global localstorage

                /* if (ionic.Platform.platform() != "win32") {
                    $cordovaPush.register({ "senderID": "767122101153" });
                } */

                $ionicLoading.hide();

                UserInterestsSrv.get();console.log("validateUser UserInterestsSrv")

                $rootScope.$emit("profile-updated");

                $state.go('tab.news'); //redirige hacia news

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
