angular.module('lufke').factory('PostsService', function($localStorage, lodash) {
    return {
        getPosts: function() {
            //TODO: debe mergear noticias nuevas, eliminar las no existentes, y mantener las antiguas.
            //      Puede enviar al server los ID de posts en caché y que el servidor mande lo que corresponda.
            var postsList;
            console.log("localStorage.newsUpdateNumber % 2 = " + $localStorage.newsUpdateNumber % 2);
            if ($localStorage.newsUpdateNumber % 2 === 0) {
                postsList = lodash.filter(dummyPosts, function(item) {
                    return item.postId <= 3;
                });
            } else {
                postsList = lodash.filter(dummyPosts, function(item) {
                    return item.postId > 3;
                });
            }
            return postsList;
        },
        getPost: function(id) {
            return lodash.find(dummyPosts, function(item) {
                return item.postId == id;
            });
        },
        deletePost: function(postId) {
            var removed = lodash.remove(dummyPosts, function(post) {
                console.log("post.postId == postId: " + post.postId + "==" + postId);
                return post.postId == postId;
            });
            console.log(removed.length > 0);
            return removed.length > 0;
        },
        newPost: function(experienceText, mediaSelected) {
            dummyPosts.unshift({
                "postId": Date.now(),
                "backgroundImgUrl": mediaSelected,
                "profile": {
                    "image": "http://placehold.it/48x48",
                    "name": "CURRENT USER"
                },
                "location": "",
                "timestamp": Date.now(),
                "text": experienceText,
                "totalStars": 0,
                "totalComments": 0,
                "isLiked": false,
                "comments": []
            });
        },
        toggleLike: function(postId) {
            var post = lodash.find(dummyPosts, function(item) {
                return item.postId == postId;
            });
            if (post.isLiked) {
                post.isLiked = false;
                post.totalStars--;
            } else {
                post.isLiked = true;
                post.totalStars++;
            }
            return true;
        },
        sharePost: function(postId) {
            //TODO: compartir post
            return true;
        },
        reportPost: function(postId) {
            //TODO: reportar post
            return true;
        },
        deleteComment: function(postId, commentId) {
            var post = lodash.find(dummyPosts, function(item) {
                return item.postId == postId;
            });
            var removed = lodash.remove(post.comments, function(comment) {
                console.log("comment.commentId == commentId: " + comment.commentId + "==" + commentId);
                return comment.commentId == commentId;
            });
            return removed.lenght > 0;
        },
        addComment: function(postId, commentText) {
            var post = lodash.find(dummyPosts, function(item) {
                return item.postId == postId;
            });
            return post.comments.unshift({
                "commentId": Date.now(),
                "profile": {
                    "name": "CURRENT USER",
                    "image": "http://placehold.it/48x48"
                },
                "timestamp": "0m",
                "text": commentText
            });
        }
    };
});