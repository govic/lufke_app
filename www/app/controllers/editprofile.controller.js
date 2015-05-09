angular.module('lufke').controller('EditProfileController', function($http, $scope, $stateParams, $ionicActionSheet, $ionicPopup) {
    console.log('Inicia ... EditProfileController');
    $http.post(api.user.getEditProfile).success(function(profile, status, headers, config) {
        $scope.model = profile;
    }).error(function(data, status, headers, config) {
        console.dir(data);
        console.log(status);
        $scope.showMessage("Error", "Ha ocurrido un error al cargar sus datos de perfil.");
    });
    $scope.editProfile = function() {
        $http.post(api.user.editProfile, $scope.model).success(function(profile, status, headers, config) {
            $scope.model = profile;
            $scope.showMessage("Exito!", "Sus datos han sido actualizados exitosamente.");
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", err.ExceptionMessage);
        });
    }
    $scope.showImagesOptions = function(imageType) {
        var options = $ionicActionSheet.show({
            buttons: [{
                text: '<i class="ion-share"></i> <span>Photo</span>'
            }, {
                text: '<i class="ion-flag"></i> <span>Gallery</span>'
            }],
            cancelText: 'Cancelar',
            cancel: function() {},
            buttonClicked: function(index) {
                console.log("presionado botón nro: " + index);
                switch (index) {
                    case 0:
                        $scope.getPhoto(navigator.camera.PictureSourceType.CAMARA, imageType);
                        break;
                    case 1:
                        $scope.getPhoto(navigator.camera.PictureSourceType.PHOTOLIBRARY, imageType);
                        break;
                    default:
                        $scope.showMessage("Error", "Un error desconocido ha ocurrido.");
                        break;
                }
                return true;
            }
        });
    };
    $scope.getPhoto = function(source, imageType) {
        var options = {
            quality: 75,
            correctOrientation: true,
            destinationType: navigator.camera.DestinationType.DATA_URL, //DATA_URL,FILE_URI
            encodingType: navigator.camera.EncodingType.JPEG, //PNG,JPEG
            sourceType: source, //CAMARA,PHOTOLIBRARY,SAVEDPHOTOALBUM
            allowEdit: true,
            targetWidth: 420,
            targetHeight: 420
        };
        navigator.camera.getPicture(function(imageBase64) {
            $http.post(api.user.editProfileImage, {
                imageBase64: imageBase64,
                imageMimeType: "image/jpeg",
                imageType: imageType
            }).success(function(profile, status, headers, config) {
                $scope.showMessage("Exito", "La imagen ha sido cargada exitosamente.");
                //TODO actualizar imagen con la carga reciente
            }).error(function(err, status, headers, config) {
                console.dir(err);
                console.log(status);
                $scope.showMessage("Error", "Error al cargar imagen.");
            });
        }, function(err) {
            $scope.showMessage("Error", "Ha ocurrido un error al intentar cargar la imagen.");
        }, options);
        return false;
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