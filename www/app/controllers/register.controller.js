angular.module('lufke').controller('RegisterController', function( $ionicHistory, $state, $localStorage, $scope, $http, $base64, $ionicPopup) {
    console.log('Inicia ... RegisterController');
    $scope.loginImage = 'assets/img/login.png';
    //elimina datos sesion usuario activo
    $localStorage.session = null;
    $localStorage.basic = null;
    $http.defaults.headers.common.Authorization = null;
    $scope.model = {
        user: {
            name: "",
            email: "",
            password: "",
            passwordVerify: ""
        },
        registerError: false,
        registerErrorMsg: ""
    };
    $scope.passwordVerify = function() {
        //console.log("verificacion = " + ($scope.model.user.password == $scope.model.user.passwordVerify));
        //if ($scope.model.user.password && $scope.model.user.passwordVerify) return $scope.model.user.password != $scope.model.user.passwordVerify;
        if ($scope.model.user.password && $scope.model.user.password.trim() != "" && $scope.model.user.passwordVerify && $scope.model.user.passwordVerify.trim() != "") {
            if ($scope.model.user.password == $scope.model.user.passwordVerify) return false;
        }
        return true;
    };
    $scope.register = function() {
        console.log('RegisterController ... register');
        $scope.model.registerErrorMsg = "";
        if ($scope.model.user.name !== "" && $scope.model.user.email !== "" && $scope.model.user.password !== "" && $scope.model.user.passwordVerify !== "") {
            var userModel = new User({
                userName: $scope.model.user.name,
                email: $scope.model.user.email,
                passwordHash: $base64.encode(unescape(encodeURIComponent($scope.model.user.password)))
            });
            $http.post(api.user.register, userModel).success(function(user, status, headers, config) {
                $scope.showMessage("Éxito", "Usuario registrado exitosamente!");
                var auth = 'Basic ' + user.credentialsHash;
                $http.defaults.headers.common.Authorization = auth;//cabecera auth por defecto
                $localStorage.basic = auth;//guarda cabecera auth en var global localstorage
                $localStorage.session = user.id; //guarda id usuario para consultas - global localstorage
                $state.go('editprofile'); //redirige hacia editar perfil
                return;
            }).error(function(data, status, headers, config) {
                console.dir(data);
                console.dir(status);
                $scope.model.registerError = true;
                if (status == 404) $scope.showMessage("Error", "El servidor de datos está sin conexión, por favor intente más tarde.");
                else $scope.showMessage("Error", data.ExceptionMessage);
            });
        }
    };
    $scope.goToLogin = function(){
        $ionicHistory.nextViewOptions({
              disableAnimate: true,
              disableBack: true
        });
        $state.go('login');
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
});
