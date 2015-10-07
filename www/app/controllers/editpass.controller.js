angular.module('lufke').controller('EditPassController', function($ionicHistory, $rootScope, $ionicLoading, $http, $scope, $ionicActionSheet, $ionicPopup, $localStorage, $base64, ShowMessageSrv) {
    console.log('Inicia ... EditPassController');

    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $scope.btnGuardarText = "Guardar";
    $scope.showMessage = ShowMessageSrv;
    $scope.model = {};

    var guardarDisabled = false;

    $scope.cancel = function(){
        $ionicHistory.goBack();
    }
    $scope.editPass = function($form) {
        if(guardarDisabled) return;


        //Valido de que existan todos los campos necesarios.
        [$form.newPassword, $form.oldPassword, $form.repeatPassword].forEach(function(campo){
            if(!campo.$modelValue || campo.$modelValue.length <= 0){
                campo.$invalid = true;
                campo.$touched = true;
                $form.$valid = false;
                $form.$invalid = true;
            }
        });
        if($form.$invalid) return false;


        var _form = {
            oldPasswordHash: $base64.encode(unescape(encodeURIComponent($scope.model.oldPassword))),
            newPasswordHash: $base64.encode(unescape(encodeURIComponent($scope.model.newPassword))),
            repeatPasswordHash: $base64.encode(unescape(encodeURIComponent($scope.model.repeatPassword)))
        };


        $scope.btnGuardarText = "Guardando...";
        guardarDisabled = true;
        try{
            $http.post(api.user.editPass, _form).success(function(credentialsHash, status, headers, config) {
                var auth = 'Basic ' + credentialsHash;
                $http.defaults.headers.common.Authorization = auth; //cabecera auth por defecto
                $localStorage.basic = auth; //guarda cabecera auth en var global localstorage

                $scope.showMessage("Exito!", "Tu contraseña ha sido actualizada.");
                $ionicHistory.goBack();

                $scope.btnGuardarText = "Guardar";
                guardarDisabled = false;
            }).error(function(err, status, headers, config) {
                console.dir(err);
                console.log(status);
                $scope.showMessage("Error", err.ExceptionMessage);

                $scope.btnGuardarText = "Guardar";
                guardarDisabled = false;
            });
        }catch(e){
            $scope.btnGuardarText = "Guardar";
            guardarDisabled = false;
        }
    }
});
