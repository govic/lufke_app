angular.module('lufke').controller('NewsController', function($ionicPlatform, $ionicLoading, $rootScope, lodash, profileService, $http, $state, $scope, $localStorage, $ionicPopup, PostsService, $timeout, FilterInterests, PageSize /*, Camera, FileTransfer*/ ) {
    console.log('Inicia ... NewsController');

    var page = 0;


    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $scope.unknown_post = url_post;

    $scope.model = {
        posts: [],
        isExperienceTextFocus: false,
        mediaSelected: false,
        imageBase64: "",
        experienceText: "",
        moreData: true
    };

    function Clone(obj){
        var _tmp = {};

        for(var attr in obj){
            _tmp[attr] = obj[attr];
        }

        return _tmp;
    }

    $scope.updateNews = function(){
        var _form = Clone(FilterInterests);
        _form.page = page = 1;
        _form.limit = PageSize;

        $scope.model.posts = [];

        $http.post(api.post.getAll, _form).success(function(data) {
            $scope.model = {
                posts: data,
                isExperienceTextFocus: false,
                mediaSelected: false,
                imageBase64: "",
                experienceText: "",
                moreData: data.length > 0
            };
            $scope.$broadcast('scroll.refreshComplete');
        })
        .error(function(data){
            console.log(data);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar las publicaciones.");
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
        if ($scope.model.moreData) {
            var last = lodash.last($scope.model.posts);
            var full_post = $scope.model.posts.length;

            var _form = Clone(FilterInterests);
            page = page || 0;
            _form.page = ++page;
            _form.limit = PageSize;

            $http.post(api.post.getAll, _form).success(function(data) {
                if (data && data.length > 0) {
                    $scope.model.posts = $scope.model.posts.concat( data );
                } else {
                    $scope.model.moreData = false;
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }).error(function(err) {
                $scope.model.moreData = false;
                $scope.showMessage("Error", "Ha ocurrido un error al cargar las publicaciones.");
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
    };
    function Reload(){
        var _form = Clone(FilterInterests);
        _form.page = page = 1;
        _form.limit = PageSize;

        $scope.model.posts = [];

        $http.post(api.post.getAll, _form)
            .success(function(data) {
                $scope.model = {
                    posts: data,
                    isExperienceTextFocus: false,
                    mediaSelected: false,
                    imageBase64: "",
                    experienceText: "",
                    moreData: data.length > 0
                };
                $scope.$broadcast('scroll.refreshComplete');
            })
            .error(function(){
                $scope.showMessage("Error", "Ha ocurrido un error al cargar las publicaciones.");
                $scope.$broadcast('scroll.refreshComplete');
            });
    }

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
    var $filtersSaved = $rootScope.$on("filters-saved", Reload);
    var $userForsook = $rootScope.$on("user-forsook", Reload);
    var $followingUser = $rootScope.$on("following-user", Reload);

    var $destroy = $rootScope.$on("$destroy", function(){
        $commentAdded();
        $commentDeleted();
        $filtersSaved();
        $commentAdded();
        $followingUser();
        $userForsook();
        $toggleLike();
        $destroy();
    })
    $scope.$on('$stateChangeSuccess', function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
    });
    $scope.viewProfile = function(authorId) {
        profileService.viewprofile(authorId);
    };
    $rootScope.$on('newPost', function(event, args) {
        //$scope.model.posts.unshift(args.post);
        Reload();
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
