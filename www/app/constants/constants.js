//var url_files = 'http://betalufkegovic.azurewebsites.net'; //sirve para local y celular
//var url_files = 'http://testlufkegobic.azurewebsites.net'; //sirve para local y celular
var url_files = 'http://192.168.0.108:50608'; //sirve para local y celular
var url_base = url_files + '/api'; //sirve para local y celular

var url_user = 'assets/img/uknown_user.png';
var url_background = 'assets/img/unknown_background.png';
var url_post = 'assets/img/unknown_post.png';
var url_adn = 'assets/img/profiledna.png'
var adn_vertical = "assets/img/profiledna_vertical.png";

var api = {
    user: {
        addInterestToProfile: url_base + '/user/addinterest',
        deleteInterest: url_base + '/user/deleteinterest',
        editProfile: url_base + '/user/editprofile',
        editProfileImage: url_base + '/user/editprofileimage',
        followers: url_base + '/user/followers',
        following: url_base + '/user/following',
        friends: url_base + '/user/friends?userid=:userid&limit=:limit&page=:page&orderby=:orderby',
        getEditProfile: url_base + '/user/geteditprofile',
        getProfile: url_base + '/user/getprofile',
        getPublicProfile: url_base + '/user/getpublicprofile',
        getSuggestedInterests: url_base + '/user/suggestedinterests?limit=:limit&page=:page',
        interests: url_base + '/user/interests',
        login: url_base + '/user/login',
        logout: url_base + '/user/logout',
        myNews: url_base + '/user/getnews',
        register: url_base + '/user/register',
        search: url_base + "/user/search?limit=:limit&page=:page&userid=:userid&interestid=:interestid&texttofind=:texttofind&orderby=:orderby",
        searchInterests: url_base + '/user/searchinterests',
        setRegistrationKey: url_base + '/user/setregistrationkey'
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
        followCategory: url_base + '/explore/followcategory',
        followUser: url_base + '/notification/followuser',
        getPopulars: url_base + '/explore/getexploredata',
        getSearchUsers: url_base + '/explore/getsearchusers',
        interest: url_base + "/explore/interest?limit=:limit&page=:page&name=:name&orderby=:orderby"
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
    },
    interest: {
        get: "/interest/:id"
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

angular
.module("lufke")
.constant("maxExperienceTextSize", 140);
