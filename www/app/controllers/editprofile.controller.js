angular.module('lufke').controller('EditProfileController', function($ionicHistory, $rootScope, $ionicLoading, $http, $scope, $ionicActionSheet, $ionicPopup, ShowMessageSrv) {
    console.log('Inicia ... EditProfileController');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $scope.btnGuardarText = "Guardar";
    var guardarDisabled = false;

    $scope.model = {};
    $scope.cancel = function(){
        $ionicHistory.goBack();
    }
    $scope.updateEditProfile = function(){
        $http.post(api.user.getEditProfile).success(function(profile, status, headers, config) {
            $scope.model = profile;
            //console.dir($scope.model);
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar sus datos de perfil.");
        });
    };
    $scope.editProfile = function($form) {
        if(guardarDisabled) return;
        $scope.btnGuardarText = "Guardando...";
        guardarDisabled = true;
        if($scope.model.userType === 'Persona'){
            $scope.model.profileLastName = null;
        }
        try{
            $http.post(api.user.editProfile, $scope.model).success(function(profile, status, headers, config) {
                $scope.model = profile;
                $scope.showMessage("Exito!", "Sus datos han sido actualizados exitosamente.");
                $ionicHistory.goBack();
                $rootScope.$emit("profile-updated");

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
    $scope.showImagesOptions = function(imageType) {
        var hideSheet = $ionicActionSheet.show({
            buttons: [{
                text: '<i class="ion-share"></i> <span>Photo</span>'
            }, {
                text: '<i class="ion-flag"></i> <span>Gallery</span>'
            }],
            cancelText: 'Cancelar',
            cancel: function() {},
            buttonClicked: function(index) {
                //console.log("presionado botón nro: " + index);
                switch (index) {
                    case 0:
                        GetPhoto(navigator.camera.PictureSourceType.CAMARA, imageType);
                        break;
                    case 1:
                        GetPhoto(navigator.camera.PictureSourceType.PHOTOLIBRARY, imageType);
                        break;
                    default:
                        $scope.showMessage("Error", "Un error desconocido ha ocurrido.");
                        break;
                }
                return true;
            }
        });
    };
    function GetPhoto(source, imageType) {
        var options = {
            allowEdit: false,
            correctOrientation: true,
            destinationType: navigator.camera.DestinationType.DATA_URL, //DATA_URL,FILE_URI
            encodingType: navigator.camera.EncodingType.JPEG, //PNG,JPEG
            quality: 75,
            sourceType: source //CAMARA,PHOTOLIBRARY,SAVEDPHOTOALBUM
            //targetWidth: 420,
            //targetHeight: 420
        };
        navigator.camera.getPicture(function(imageBase64) {
            $http.post(api.user.editProfileImage, {
                imageBase64: imageBase64,
                imageMimeType: "image/jpeg",
                imageType: imageType
            }).success(function(profile, status, headers, config) {
                $scope.updateEditProfile();
                /*$scope.showMessage("Exito", "La imagen ha sido cargada exitosamente.");*/
                $rootScope.$emit("profile-updated");
            }).error(function(err) {
                console.dir(err);
                console.log(status);
                if(!/cancel/.test(err)) $scope.showMessage("Error", "Error al cargar imagen.");
            });
        }, function(err) {
            console.log(err);
            $scope.showMessage("Error", "Ha ocurrido un error al intentar cargar la imagen.");
        }, options);
        return false;
    };
    $scope.showMessage = ShowMessageSrv;

    $ionicLoading.show();
    $http.post(api.user.getEditProfile)
    .success(function(profile, status, headers, config) {
        $scope.model = profile;
        $ionicLoading.hide();
    }).error(function(data, status, headers, config) {
        console.dir(data);
        console.log(status);
        $ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error al cargar sus datos de perfil.");
    });
});
