angular.module('lufke').controller('UserNewsController', function($ionicHistory, $ionicLoading, $rootScope, lodash, profileService, $http, $state, $scope, $localStorage, $ionicPopup, PostsService, $timeout, $stateParams, ShowMessageSrv /*, Camera, FileTransfer*/ ) {
    console.log('Inicia ... UserNewsController');

    var page = 1, limit = 10;

    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $scope.unknown_post = url_post;
    $scope.model = {
        posts: [],
        moreData: false
    };


    $scope.cancel = function(){
        $ionicHistory.goBack();
    }
    $scope.updateNews = function() {
        $http.get(api.user.myNews, { params: { userId: $stateParams.userId, limit: limit, page: 1 } }).success(function(data) {
            $scope.model = {
                posts: data,
                isExperienceTextFocus: false,
                mediaSelected: false,
                imageBase64: "",
                experienceText: "",
                moreData: data.length >= limit
            };
            page = 1;
            $scope.$broadcast('scroll.refreshComplete');
        }).error(function(err) {
            $scope.model.moreData = false;
            $scope.showMessage("Error", "Ha ocurrido un error al cargar las publicaciones antiguas.");
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
    $scope.toggleLike = function(post) {
        var postId = post.id;
        var original = {
            isLiked: post.isLiked,
            totalStars: post.totalStars
        };

        //Cambio el valor del Like.
        post.isLiked = !post.isLiked;

        //Con el nuevo valor del Like, actualizo el contador de Likes.
        if(post.isLiked) post.totalStars++;
        else post.totalStars--;

        $http.post(api.post.toggleLike, {
            id: postId
        }).success(function(data) {
            //var post = lodash.find($scope.model.posts, { id: postId });
            //post.totalStars = data.likes;
            //post.isLiked = data.isLiked;
            $rootScope.$emit("toggle-like", { id: postId, isLiked: post.isLiked, totalStars: post.totalStars });
        }).error(function(data) {
            console.dir(data);
            $scope.showMessage("Error", "Ha ocurrido un error al hacer like.");
            post.isLiked = original.isLiked;
            post.totalStars = original.totalStars;
        });
    };

    $scope.moreNews = function() {
        if ($scope.model.moreData){
            var params = {
                limit: limit,
                page: page++,
                userId: $stateParams.userId
            }

            $http.get( api.user.myNews, { params: params }).success(function(data) {
                if (data && data.length > 0) {
                    $scope.model.posts = $scope.model.posts.concat(data);
                    if (data.length < limit) {
                        $scope.model.moreData = false;
                    }else{
                        $scope.model.moreData = true;
                    }
                } else {
                    $scope.model.moreData = false;
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }).error(function(err) {
                $scope.model.moreData = false;
                $scope.showMessage("Error", "Ha ocurrido un error al cargar las publicaciones antiguas.");
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
    };
    $scope.$on('$stateChangeSuccess', function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
    });
    $scope.viewProfile = function(authorId) {
        profileService.viewprofile(authorId);
    };

    var $commentAdded = $rootScope.$on("comment-added", function(e, args){
        //args = { id:<comment id>, postId: <post id> }
        var _post = lodash.find($scope.model.posts, { id: args.postId });
        if(_post){
            _post.totalComments = parseInt(_post.totalComments);
            _post.totalComments++;
        }
    });
    var $commentDeleted = $rootScope.$on("comment-deleted", function(e, args){
        //args = { id:<comment id>, postId: <post id> }
        var _post = lodash.find($scope.model.posts, { id: args.postId });
        if(_post){
            _post.totalComments = parseInt(_post.totalComments);
            _post.totalComments--;
        }
    });
    var $toggleLike = $rootScope.$on("toggle-like", function(e, args){
        //{ id: <int>, isLiked: <bool> }
        var _post = lodash.find($scope.model.posts, { id: args.id });
        if(_post){
            _post.isLiked = args.isLiked;
            _post.totalStars = args.totalStars;
        }
    });
    var $newPost = $rootScope.$on('newPost', function(event, args) {
        $scope.model.posts.unshift(args.post);
    });
    var $destroy = $rootScope.$on("$destroy", function(){
        $commentAdded();
        $commentDeleted();
        $newPost();
        $toggleLike();
        $destroy();
    });


    $scope.showMessage = ShowMessageSrv;


    var params = {
        limit: limit,
        page: page++,
        userId: $stateParams.userId
    }
    $ionicLoading.show();
    $http.get( api.user.myNews, { params: params }).success(function(data) {
        if (data && data.length > 0) {
            $scope.model.posts = $scope.model.posts.concat(data);
            if (data.length < limit) {
                $scope.model.moreData = false;
            }else{
                $scope.model.moreData = true;
            }
        } else {
            $scope.model.moreData = false;
        }
        $ionicLoading.hide();
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }).error(function(err) {
        $ionicLoading.hide();
        $scope.model.moreData = false;
        $scope.showMessage("Error", "Ha ocurrido un error al cargar las publicaciones antiguas.");
        $scope.$broadcast('scroll.infiniteScrollComplete');
    });
});
