angular.module('lufke').controller('UserNewsController', function($ionicLoading, $rootScope, lodash, profileService, $http, $state, $scope, $localStorage, $ionicPopup, PostsService, $timeout, $stateParams, ShowMessageSrv /*, Camera, FileTransfer*/ ) {
    console.log('Inicia ... UserNewsController');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $scope.unknown_post = url_post;
    $ionicLoading.show();

    $http.get(api.user.myNews, { params: { userId: $stateParams.userId } }, { cache: false }).success(function(data) {
        $scope.model = {
            posts: data.news,
            isExperienceTextFocus: false,
            mediaSelected: false,
            imageBase64: "",
            experienceText: "",
            moreData: true
        };
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
    });
    $scope.updateNews = function() {
        $http.get(api.user.myNews, { params: { userId: $stateParams.userId } }).success(function(data) {
            $scope.model = {
                posts: data.news,
                isExperienceTextFocus: false,
                mediaSelected: false,
                imageBase64: "",
                experienceText: "",
                moreData: true
            };
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.toggleLike = function(post) {

        var postId = post.id;
        var original = {
            isLiked: post.isLiked,
            totalStars: post.totalStars
        };

        $http.post(api.post.toggleLike, {
            id: postId
        }).success(function(data) {
            //var post = lodash.find($scope.model.posts, { id: postId });
            //post.totalStars = data.likes;
            //post.isLiked = data.isLiked;
        }).error(function(data) {
            console.dir(data);
            $scope.showMessage("Error", "Ha ocurrido un error al hacer like.");
            post.isLiked = original.isLiked;
            post.totalStars = original.totalStars;
        });

        //Cambio el valor del Like.
        post.isLiked = !post.isLiked;

        //Con el nuevo valor del Like, actualizo el contador de Likes.
        if(post.isLiked) post.totalStars++;
        else post.totalStars--;
    };

    $scope.moreNews = function() {
        console.log('$scope.moreNews .........');
        console.log("inicia carga: " + $scope.model.moreData);
        if ($scope.model.moreData) {
            var last = lodash.last($scope.model.posts);
            var full_post = $scope.model.posts.length;

            var params = {
                userId: $stateParams.userId,
                lastId: last ? last.id : 0,
                lastTimestamp: last ? last.postTimestamp : ""
            }

            $http.get( api.user.myNews, { params: params }).success(function(data) {
                if (data.news && data.news.length > 0) {
                    lodash.forEach(data.news, function(post) {
                        $scope.model.posts.push(post);
                    });
                    var full_post_aux = $scope.model.posts.length;
                    console.log("posts anteriores: " + full_post + ", posts luego de carga:" + full_post_aux);
                    if (full_post >= full_post_aux) {
                        $scope.model.moreData = false;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    console.log("seguir cargando datos: " + $scope.model.moreData);
                } else {
                    $scope.model.moreData = false;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            }).error(function(err) {
                $scope.model.moreData = false;
                $scope.showMessage("Error", "Ha ocurrido un error al cargar las publicaciones antiguas.");
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
    };
    $scope.$on('$stateChangeSuccess', function() {
        console.log("NewsController ... $stateChangeSuccess");
        $scope.$broadcast('scroll.infiniteScrollComplete');
    });
    $scope.viewProfile = function(authorId) {
        profileService.viewprofile(authorId);
    };
    $rootScope.$on('newPost', function(event, args) {
        $scope.model.posts.push(args.post);
    });
    $scope.showMessage = ShowMessageSrv;
});