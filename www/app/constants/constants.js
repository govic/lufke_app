//var url_base = 'http://localhost:3000'; //server local con explorador
//var url_base = 'http://lufke-server-44936.onmodulus.net'; //server modulus
//var url_base = 'http://10.0.2.2:3000'; //server local dentro del emulador
//var url_base = 'http://192.168.0.100:3000'; //server local dentro del emulador
var url_base = 'http://localhost:8080/api';
//var url_base = 'http://192.168.0.100:53110/api';
//var url_base = 'http://10.0.2.2:8080/api';
//var url_base = 'http://192.168.0.101:8080/api';
var url_files = 'http://localhost:8080';
var api = {
    user: {
        login: url_base + '/user/login',
        register: url_base + '/user/register'
    },
    post: {
        get: url_base + '/post/get',
        getAll: url_base + '/news/getnews',
        create: url_base + '/post/create',
        delete: url_base + '/post/delete',
        toggleLike: url_base + '/post/togglelikepost',
        uploadTest: url_base + '/post/uploadImage',
        comment: {
            create: url_base + '/post/addcomment',
            delete: url_base + '/post/deletecomment'
        }
    },
    explore: {
        getPopulars: url_base + '/explore/getexploredata',
        followCategory: url_base + '/explore/followcategory',
        followUser: url_base + '/notification/followuser'
    },
    notifications: {
        getNotifications: url_base + '/notification/getnotificationsdata',
        ignoreRequest: url_base + '/notification/ignorerequest',
        acceptRequest: url_base + '/notification/acceptrequest'
    }
};

function getPostBackgroundUlr(post) {
    return post.hasBackgroundImg ? url_base + "/images/posts/" + post._id + ".png" : "";
}
/* Modelos de datos
 *
 * Los modelos de datos deben corresponde a los modelos JsonModel
 * del servidor WebApi2.
 *
 */
var User = function(params) {
    var self = this;
    self.id = params.id;
    self.userName = params.userName;
    self.email = params.email;
    self.passwordHash = params.passwordHash;
    self.credentialsHash = params.credentialsHash;
    self.createdAt = params.createdAt;
    self.role = params.role;
};