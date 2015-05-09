angular.module('lufke').controller('NewsController', function(lodash, $http, $scope, $localStorage, $ionicPopup, PostsService /*, Camera, FileTransfer*/ ) {
    console.log('Inicia ... NewsController');
    $scope.url = url_files;
    $http.post(api.post.getAll).success(function(data) {        
        $scope.model = {
            posts: data.news,
            isExperienceTextFocus: false,
            mediaSelected: false,
            imageBase64: "",
            experienceText: "",            
        };
    });
    $scope.updateNews = function() {
        //TODO: hay que sacar el uso de localstorage, es solo para el dummy
        $localStorage.newsUpdateNumber++;
        $scope.$broadcast('scroll.refreshComplete');
        $http.post(api.post.getAll).success(function(data) {           
            $scope.model = {
                posts: data.news,
                isExperienceTextFocus: false,
                mediaSelected: false,
                imageBase64: "",
                experienceText: ""
            };
        });
    };
    $scope.toggleLike = function(postId) {
        $http.post(api.post.toggleLike, {
            id: postId
        }).success(function(data) {
            var post = lodash.find($scope.model.posts, {
                id: postId
            });
            post.totalStars = data.likes;
            post.isLiked = data.isLiked;
        }).error(function(data) {
            console.dir(data);
            $scope.showMessage("Error", "Ha ocurrido al hacer like.");
        });
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
            $http.post(api.post.create, post).success(function(user) {
                $scope.model.experienceText = "";
                $scope.model.mediaSelected = false;
                $scope.model.imageBase64 = "";
                $http.post(api.post.getAll).success(function(data) {
                    $scope.model.posts = data.news;
                });
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