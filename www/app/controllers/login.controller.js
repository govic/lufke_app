angular.module('lufke').controller('LoginController', function(fb, $cordovaOauth, $ionicHistory, $rootScope, $cordovaPush, $localStorage, $http, $scope, $state, $ionicHistory, $ionicPopup, $base64, $ionicLoading, UserInterestsSrv, GetUri) {
    console.log('Inicia ... LoginController');

    UserInterestsSrv.reset();

    $scope.url = url_files;
    $scope.loginImage = 'assets/img/login.png';

    $ionicHistory.clearCache();

    //verificacion de datos estaticos de autenticacion
    //$ionicLoading.show();

    /*
    if ($localStorage.basic && $localStorage.basic.trim() != "") {
        Login( $localStorage.basic.split(" ")[1] );
	} else {
		$ionicLoading.hide();
		$localStorage.basic = null;
		$localStorage.session = null;
	}
    */

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
        $http.defaults.headers.common.Authorization = null;
        $localStorage.basic = null;
        $localStorage.session = null;
        $localStorage["login-data"] = null;
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
    }
    $scope.validateUser = function() {
        console.log('LoginController ... validateUser');
        if ($scope.model.user.email !== "" && $scope.model.user.password !== "") {
            Login( $base64.encode( unescape( encodeURIComponent( $scope.model.user.name + ":" + $scope.model.user.password ) ) ) );
        } else {
            $localStorage.session = null;
            $scope.model.user.password = "";
        }
    };
    $scope.facebook = function(){
        //Hacemos login en facebook.
        $cordovaOauth.facebook(fb.appId, fb.permissions).then(function(result) {
                //result = { access_token: "", expires_in: "" }
                //Access_token para realizar peticiones a los servicios de facebook.
                //$localStorage["login-data"] = $base64.encode( unescape( encodeURIComponent( username + "&" + data.id ) ) );
                result.id = fb.id;  //Indicamos que la data almacenada es correspondiente a facebook.
                $localStorage["login-data"] = $base64.encode( JSON.stringify( result ) );
                $http
                    .get(fb.srv, { params: { access_token: result.access_token, fields: fb.fields, format: "json" } })
                    .success(GetData)
                    .error(function(err){ $scope.err=err; Error(err); })
            }, function(err){ $scope.err=err; Error(err); });
    }

    function GetData(data){
        //El nombre de usuario es el texto anterior al caracter "@" del email registrado en facebook.
        var username = data.email.replace(/@.+$/, "");

        //Verificamos si el usuario ya está registrado en la aplicación, con el id. que el usuario tiene en facebook.
        //'/user/getuser?clientid=:clientId&socialnetwork=:socialnetwork',
        var uri = GetUri(api.user.getUser, { clientId: data.id, socialnetwork: fb.id });

        $http.post(uri).success(function(userdata){
            //Si el usuario existe, se redirige a "news".
            if(null != userdata && userdata.profileId > 0){
                //10207021395189582
                //La password definida para un usuario que ingresa con facebook es su username de correo electronico y su id en facebook codificado en base 64.
                console.log(username + ":" + data.id)
                console.log($base64.encode( unescape( encodeURIComponent( username + "&" + data.id ) ) ))
                var pass = $base64.encode( unescape( encodeURIComponent( username + "&" + data.id ) ) );
                var credentialsHash = $base64.encode( unescape( encodeURIComponent( username + ":" + pass ) ) );
                return Login(credentialsHash);
            }
        }).error(function(err, status, headers, config){
            if(err.ExceptionMessage == "Usuario no encontrado"){
                //Si el usuario no existe, se registra en lufke.
                console.log(username + ":" + data.id)
                console.log($base64.encode( unescape( encodeURIComponent( username + "&" + data.id ) ) ))
                var pass = $base64.encode( unescape( encodeURIComponent( username + "&" + data.id ) ) );

                var registro = {
                    socialnetwork: fb.id,
                    clientid: data.id,
                    email: data.email,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    location: data.location ? data.location.name : "",
                    /* La password definida para un usuario que ingresa con facebook es su username de correo electronico y su id en facebook codificado en base 64. */
                    passwordhash: $base64.encode( unescape( encodeURIComponent( pass ) ) ),
                    username: username
                };

                $http.post(api.user.register, registro).success(function(user, status, headers, config) {
                    $scope.showMessage("Éxito", "Te has registrado exitosamente!");
                    var auth = 'Basic ' + user.credentialsHash;
                    $localStorage.basic = auth;//guarda cabecera auth en var global localstorage
                    $localStorage.session = user.id; //guarda id usuario para consultas - global localstorage

                    //Una ves registrado se redirige a "news"
                    $state.go('tab.news');
                    return;
                }).error(function(err){ $scope.err=err; Error(err); });
            }else{
                $scope.err=err; Error(err);
            }
        });
    }

    function Error(data){
        console.log("Error...")
        console.log(data)
        $scope.showMessage("Error", "¡Ups!, ha ocurrido un error. Por favor intenta más tarde.");
    }

    function Login(credentialsHash){
        $ionicLoading.show();

        $http.post(api.user.login, {
            credentialsHash: credentialsHash
        })
        .success(LoginDone)
        .error(function(err, status, headers, config) {
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
    }


    function LoginDone(user, status, headers, config) {
        var auth = 'Basic ' + user.credentialsHash;
        $http.defaults.headers.common.Authorization = auth; //cabecera auth por defecto
        $localStorage.basic = auth; //guarda cabecera auth en var global localstorage
        $localStorage.session = user.id; //guarda id usuario para consultas - global localstorage

        /* if (ionic.Platform.platform() != "win32") {
            $cordovaPush.register({ "senderID": "767122101153" });
        } */

        $ionicLoading.hide();

        UserInterestsSrv.get();

        $rootScope.$emit("profile-updated");

        $state.go('tab.news'); //redirige hacia news
    }
});
