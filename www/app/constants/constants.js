var url_files = 'http://testlufkegobic.azurewebsites.net'; //sirve para local y celular
//var url_files = 'http://192.168.0.101:8080'; //sirve para local y celular
var url_base = url_files + '/api'; //sirve para local y celular


var api = {
    user: {
        login: url_base + '/user/login',
        register: url_base + '/user/register',
        getProfile: url_base + '/user/getprofile',
        getEditProfile: url_base + '/user/geteditprofile',
        editProfile: url_base + '/user/editprofile',
        editProfileImage: url_base + '/user/editprofileimage',
        getInterests: url_base + '/user/getinterests',
        deleteInterest: url_base + '/user/deleteinterest',
        getPublicProfile: url_base + '/user/getpublicprofile'
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
        acceptRequest: url_base + '/notification/acceptrequest',
        check: url_base + '/notification/checknotifications',
        revised: url_base + '/notification/revisednotification',
        getAllNotifications: url_base + '/notification/getallnotifications'
    },
    filters: {
        getFilters: url_base + '/filter/getfiltersdata',
        saveFilters: url_base + '/filter/savefiltersdata',
        getTopInterests: url_base + '/filter/gettopinterestdata',
        editTopInterests: url_base + '/filter/edittopinterests'
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