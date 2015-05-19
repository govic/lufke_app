angular.module('lufke').controller('NewsController', function(lodash, $http, $scope, $localStorage, $ionicPopup, PostsService, $timeout /*, Camera, FileTransfer*/ ) {
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
    $scope.noMoreItemsAvailable = false;
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
    $scope.moreNews = function() {
        if($scope.model !== undefined){
            var last = lodash.last($scope.model.posts);
        }
        console.dir(last);        
        $http.post(api.post.getAll, {
            lastId: last.id,
            lastTimestamp: last.postTimestamp
        })
        .success(function(data) {
            console.dir(data);
            lodash.forEach(data.news, function(post) {
                $scope.model.posts.push(post);
            });  
            $scope.$broadcast('scroll.infiniteScrollComplete'); 
        });
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