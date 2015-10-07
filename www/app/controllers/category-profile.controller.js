angular
.module("lufke")
.controller("CategoryProfileController", function($stateParams, $http, $scope, $ionicLoading, $ionicHistory, $ionicHistory, ShowMessageSrv, GetUri){

    $scope.url = url_files;
    $scope.unknown_post = url_post;

    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;

    $scope.showMessage = ShowMessageSrv;

    $scope.msgUsers = "buscando usuarios destacados...";
    $scope.msgPosts = "buscando publicaciones populares...";

    $scope.interestName = $stateParams.name;
    $scope.interestId = $stateParams.id;



    //Achicar mas las fotos.
    //Obtener datos del interes.
    $http.get(api.explore.getInterest.replace(/:id/, $stateParams.id))
        .success(function(interest){
            interest.previewPath = interest.previewPath ? (url_files + interest.previewPath) : url_background;
            $scope.interest = interest;
        })
        .error(function(err){
            console.log(err);
            $scope.showMessage("Error", "Ha ocurrido un error. Revisa tu conexión a internet.");
        });

    $scope.back = function(){ $ionicHistory.goBack(); }

    /* Consultar usuarios destacados (estos no son los usuarios destacados para la categoría. */
    /* Los usuarios destacados son en base al numero de seguidores que este tiene. */
    //"/user/search?limit=:limit&page=:page&userid=:userid&interestid=:interestid&texttofind=:texttofind&username=:username&firstname=:firstname&lastname=:lastname&clientid=:clientid&socialnetwork=:socialnetwork&orderby=:orderby",
    var uri = GetUri(api.user.search, { interestid: $stateParams.id, orderby: "followers desc", limit: 3,page: 1 });

    //$ionicLoading.show();
    $http.get( uri )
    .success(function(data, status, headers, config) {
        $scope.users = data;
        $scope.msgUsers = null;
        //$ionicLoading.hide();
    }).error(function(data, status, headers, config) {
        console.dir(data);
        console.dir(status);
        $scope.msgUsers = "no se encontraron usuarios destacados";
        //$ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error. Revisa tu conexión a internet.");
    });

    /* Consultar posts populares */

    //getPosts: url_base + "/explore/post?limit=:limit&page=:page&orderby=:orderby&interestid=:interestid"
    var uriposts = GetUri(api.explore.getPosts, { limit: 3, page: 1, orderby: "likes desc", interestid: $stateParams.id });

    //$ionicLoading.show();
    $http.get( uriposts )
    .success(function(data, status, headers, config) {
        $scope.posts = data;
        $scope.msgPosts = null;
        //$ionicLoading.hide();
    }).error(function(data, status, headers, config) {
        console.dir(data);
        console.dir(status);
        $scope.msgPosts = "no se encontraron publicaciones populares";
        //$ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error. Revisa tu conexión a internet.");
    });
});
