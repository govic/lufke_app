angular.module('lufke').controller('LoginController', function($localStorage, $http, $scope, $state, $ionicHistory, $ionicPopup, $base64) {
    $ionicHistory.clearCache();
    console.log('Inicia ... LoginController');
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    /*$http.get('http://static.comicvine.com/uploads/scale_small/3/39241/790730-konachan.com___41666_dragonball_son_goku.png')
    .success(function(data, status, headers, config){
        alert(data);
        alert(status);
        alert(headers);
        alert(config);        
    })
    .error(function(err, status, headers, config){
        alert(err);
        alert(status);
        alert(headers);
        alert(config);
    });*/

    $localStorage.session = null;
    $scope.model = {
        user: {
            name: "",
            password: ""
        },
        loginError: false,
        recoveryData: {
            emailError: false,
            email: ""
        },
        foto: ""
    };
    $scope.showRememberPassword = function() {
        var popupRemember = $ionicPopup.show({
            template: '	<input ng-model="model.recoveryData.email" placeholder="correo@ejemplo.com" required>\n\
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
            $ionicPopup.alert({
                title: 'Correo enviado',
                template: 'Se ha enviado un correo con su contraseña',
                buttons: [{
                    text: 'Aceptar'
                }]
            });
        }
    };
    $scope.validateUser = function() {
        console.log('LoginController ... validateUser');
        if ($scope.model.user.email !== "" && $scope.model.user.password !== "") {
            var userModel = new User({
                credentialsHash: $base64.encode(unescape(encodeURIComponent($scope.model.user.name + ":" + $scope.model.user.password)))
            });
            $http.post(
                api.user.login,
                userModel
            ).success(function(user, status, headers, config){
                var auth = 'Basic ' + user.credentialsHash;
                $http.defaults.headers.common.Authorization = auth;//cabecera auth por defecto
                $localStorage.basic = auth;//guarda cabecera auth en var global localstorage
                $localStorage.session = user.id; //guarda id usuario para consultas - global localstorage
                $scope.model.loginError = false;
                $state.go('tab.news'); //redirige hacia news
                return;
            }).error(function(data, status, headers, config){
                console.dir(data);
                console.log(status);
                $http.defaults.headers.common.Authorization = null;
                $localStorage.session = null;
                $localStorage.basic = null;
                $scope.model.loginError = true;
                $scope.model.user.password = "";
            });
        } else {
            $localStorage.session = null;
            $scope.model.loginError = true;
            $scope.model.user.password = "";
        }
    };
});