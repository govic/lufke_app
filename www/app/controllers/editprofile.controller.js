angular.module('lufke').controller('EditProfileController', function ($http, $scope, $stateParams, $ionicActionSheet, $ionicPopup) {
	console.log('Inicia ... EditProfileController');

	$http.post(api.user.getProfile)
    .success(function(profile, status, headers, config) {
        $scope.model = profile;
    }).error(function(data, status, headers, config) {
        console.dir(data);
        console.log(status);
        $scope.showMessage("Error", "Ha ocurrido un error al cargar sus datos de perfil.");
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
    $scope.showOptions = function() {
        var options = $ionicActionSheet.show({
            buttons: [{
                    text: '<i class="ion-share"></i> <span>Photo</span>'
                }, //Index = 0
                {
                    text: '<i class="ion-flag"></i> <span>Gallery</span>'
                } //Index = 1
            ],            
            cancelText: 'Cancelar',
            cancel: function() {
                //Hacer nada
            },            
            buttonClicked: function(index) {
                console.log("presionado botón nro: " + index);
                switch (index) {
                    case 0:
                        $scope.getPhoto(navigator.camera.PictureSourceType.CAMARA);
                        break;
                    case 1:
                       	$scope.getPhoto(navigator.camera.PictureSourceType.PHOTOLIBRARY);
                        break;
                    default:
                        $scope.showMessage("Error", "Un error desconocido ha ocurrido.");
                        break;
                }
                return true;
            }
        });
    };
    $scope.getPhoto = function(source) {
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
            $scope.model.imageBase64 = imageBase64;
        }, function(err) {
        	$scope.showMessage("Error", "Ha ocurrido un error al intentar cargar la imagen.");  
        }, options);
        return false;
    };    
});