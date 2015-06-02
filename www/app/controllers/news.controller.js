angular.module('lufke').controller('NewsController', function($ionicLoading, $rootScope, lodash, profileService, $http, $state, $scope, $localStorage, $ionicPopup, PostsService, $timeout /*, Camera, FileTransfer*/ ) {
    console.log('Inicia ... NewsController');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $scope.unknown_post = url_post;
    $scope.moreData = true;
    var full_post = 0;
    var full_post_aux = 0;
    $ionicLoading.show();
    $http.post(api.post.getAll).success(function(data) {        
        $scope.model = {
            posts: data.news,
            isExperienceTextFocus: false,
            mediaSelected: false,
            imageBase64: "",
            experienceText: "",
        }; 
        $ionicLoading.hide();     
    });
    $scope.updateNews = function() {
        $http.post(api.post.getAll).success(function(data) {
            $scope.model = {
                posts: data.news,
                isExperienceTextFocus: false,
                mediaSelected: false,
                imageBase64: "",
                experienceText: ""
            };
            full_post = 0;
            full_post_aux = 0;
            $scope.moreData = true;
            $scope.$broadcast('scroll.refreshComplete');
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

    $scope.moreNews = function() {
        //console.dir($scope.model);
        if($scope.moreData === true){
            var last = lodash.last($scope.model.posts);
            full_post = $scope.model.posts.length;
            //console.dir(last);        
            $http.post(api.post.getAll, {
                lastId: last.id,
                lastTimestamp: last.postTimestamp
            })
            .success(function(data) {
                //console.dir(data);
                lodash.forEach(data.news, function(post) {
                    $scope.model.posts.push(post);
                });  
                full_post_aux = $scope.model.posts.length;
                console.dir(full_post);
                console.dir(full_post_aux);
                if (full_post == full_post_aux){
                    $scope.moreData = false;
                    console.dir($scope.moreData);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete'); 
            });
        }        
    };
    $scope.viewProfile = function(authorId){
        profileService.viewprofile(authorId);
    };
    $rootScope.$on('newPost', function(event, args){
        $scope.model.posts.push(args.post);
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
});