angular.module('lufke').controller('NewPostController', function(lodash, $http, $state, $scope, $localStorage, $ionicPopup, PostsService /*, Camera, FileTransfer*/ ) {
    console.log('Inicia ... NewPostController');
    $scope.url = url_files;
     $scope.model = {            
            mediaSelected: false,
            imageBase64: "",
            experienceText: "",            
    };
    $scope.shareExperience = function() {
        if ($scope.model.mediaSelected || $scope.model.experienceText.length) {
            var post = {
                authorId: $localStorage.session,
                text: $scope.model.experienceText,
                imgBase64: $scope.model.mediaSelected ? $scope.model.imageBase64 : "",
                imgMimeType: "image/jpeg" //depende del metodo getPhoto en las opciones
            };
            console.dir(post);
            $http.post(api.post.create, post)
            .success(function(user) {
                $scope.model.experienceText = "";
                $scope.model.mediaSelected = false;
                $scope.model.imageBase64 = "";
                $http.post(api.post.getAll)
                .success(function(data) {
                    $scope.model.posts = data.news;
                });
                $state.go('tab.news'); //redirige hacia news
            });
        }
    };
    $scope.getPhoto = function() {
        var options = {
            quality: 75,
            correctOrientation: true,
            destinationType: navigator.camera.DestinationType.DATA_URL, //DATA_URL,FILE_URI
            encodingType: navigator.camera.EncodingType.JPEG, //PNG,JPEG
            sourceType: navigator.camera.PictureSourceType.CAMARA, //CAMARA,PHOTOLIBRARY
            allowEdit: true,
            targetWidth: 420,
            targetHeight: 420
        };
        navigator.camera.getPicture(function(imageBase64) {
            $scope.model.mediaSelected = true;
            $scope.model.imageBase64 = imageBase64;
            if(imageBase64){
                alert('ok');
            }
            else{
                alert('no ok');
            }
            
        }, function(err) {
            alert("Ha ocurrido un error al intentar cargar la imagen.");
            $scope.model.mediaSelected = false;
            $scope.model.imageBase64 = "";
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