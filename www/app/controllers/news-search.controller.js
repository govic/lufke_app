angular
.module("lufke")
.controller("NewsSearch", function($scope, $http, $state, $ionicLoading, profileService, GetUri, ShowMessageSrv){
    var queryUsers = { limit: 20, page: 1, texttofind: "", orderby: "firstname" };
    var queryInterest = { limit: 20, page: 1, name: "", orderby: "name" };

    var findUsersEnabled = true;
    var findUsersQueries = [];
    var findInterestsEnabled = true;
    var findInterestsQueries = [];

    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $scope.unknown_post = url_post;

    $scope.buscandoUsuarios = false;
    $scope.buscandoIntereses = false;
    $scope.placeholder = "buscar..."
    $scope.showMessage = ShowMessageSrv;
    $scope.usersLength = null;
    $scope.interstsLength = null;

    $scope.viewProfile = function(profileId){
        profileService.viewprofile(profileId);
    }
    $scope.GetUriBackground = function(interest){
        return interest.previewPath ? (url_files + interest.previewPath) : url_post;
    }
    $scope.followUser = function(item){
        $ionicLoading.show();
        $http.post(api.explore.followUser, {
            id: item.profileId
        }).success(function(data, status, headers, config) {
            $scope.users.splice($scope.users.indexOf(item), 1);
            $ionicLoading.hide();
            $scope.showMessage("Exito", "Solicitud realizada exitosamente!");
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.dir(status);
            $ionicLoading.hide();
            $scope.showMessage("Error", "Ha courrido un error al enviar la solicitud.");
        });
    }
    $scope.back = function(){
        $state.go("tab.news");
    }
    $scope.find = function(str){
        console.log(str);
        if(str && str.length){
            var texttofind = str.replace(/^\s*/, "").replace(/\s*$/, "");
            if(texttofind){
                findUsers(texttofind);
                findInterests(texttofind);
            }
        }
    }
    $scope.loadMoreUsers = function(){
        queryUsers.page++;
        var uri = GetUri(api.user.search, queryUsers);
        // "/user/search?limit=:limit&page=:page&userid=:userid&interestid=:interestid&texttofind=:texttofind&orderby=:orderby"
        console.log(uri)
        $scope.buscandoUsuarios = true;
        $scope.moreUsers = null;
        $http.get(uri)
            .success(function(data){
                $scope.users = $scope.users.concat(data);
                $scope.usersLength = $scope.users.length;
                $scope.buscandoUsuarios = false;
                $scope.moreUsers = data.length >= queryUsers.limit;
            })
            .error(Error);
    }
    $scope.loadMoreInterests = function(){
        queryInterest.page++;
        var uri = GetUri(api.explore.interest, queryInterest);
        //"/explore/interest?limit=:limit&page=:page&name=:name&orderby=:orderby"
        console.log(uri)
        $scope.buscandoIntereses = true;
        $scope.moreInterests = null;
        $http.get(uri)
            .success(function(data){
                $scope.interests = $scope.interests.concat(data);
                $scope.interstsLength = $scope.interests.length;
                $scope.buscandoIntereses = false;
                $scope.moreInterests = data.length >= queryInterest.limit;
            })
            .error(Error);
    }

    function findUsers(texttofind){
        findUsersQueries.push(texttofind);

        if(findUsersEnabled === false) return;

        ExecUsersQuery(texttofind);

    }
    function ExecUsersQuery(texttofind){
        queryUsers.texttofind = texttofind;
        queryUsers.page = 1;
        var uri = GetUri(api.user.search, queryUsers);

        $scope.buscandoUsuarios = true;
        $scope.moreUsers = null;
        $scope.usersLength = null;
        $scope.users = [];
        findUsersEnabled = false;
        $http.get(uri)
            .success(function(data){
                $scope.users = data;
                $scope.usersLength = $scope.users.length;
                $scope.buscandoUsuarios = false;
                $scope.moreUsers = data.length >= queryUsers.limit;
                findUsersEnabled = true;

                if(findUsersQueries[findUsersQueries.length - 1] !== texttofind){
                    ExecInterestsQuery(findUsersQueries[findUsersQueries.length - 1]);
                }
            })
            .error(Error);
    }
    function findInterests(texttofind){
        findInterestsQueries.push(texttofind);

        if(findInterestsEnabled === false) return;

        ExecInterestsQuery(texttofind);

    }
    function ExecInterestsQuery(texttofind){
        queryInterest.name = "like(" + texttofind + ")";
        queryInterest.page = 1;
        var uri = GetUri(api.explore.interest, queryInterest);
        // "/user/search?limit=:limit&page=:page&userid=:userid&interestid=:interestid&texttofind=:texttofind&orderby=:orderby"
        console.log(uri)
        $scope.buscandoIntereses = true;
        $scope.moreInterests = null;
        $scope.interests = [];
        $scope.interstsLength = null;
        findInterestsEnabled = false;
        $http.get(uri)
            .success(function(data){
                $scope.interests = data;
                $scope.interstsLength = $scope.interests.length;
                $scope.buscandoIntereses = false;
                $scope.moreInterests = data.length >= queryInterest.limit;
                findInterestsEnabled = true;

                if(findInterestsQueries[findUsersQueries.length - 1] !== texttofind){
                    ExecInterestsQuery(findInterestsQueries[findUsersQueries.length - 1]);
                }
            })
            .error(Error);
    }

    function Error(data, status, headers, config){
        console.log(data);
        console.log(status);
        $scope.showMessage("Error", "¡¡¡Ups!!! ha ocurrido un error. Revisa tu conexión a internet");
        $scope.buscandoUsuarios = false;
        $scope.buscandoIntereses = false;
    }
});
