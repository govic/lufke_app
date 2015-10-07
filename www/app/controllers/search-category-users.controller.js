angular
.module("lufke")
.controller("SearchCategoryUser", function(lodash, $stateParams, $scope, $http, $timeout, $ionicLoading, $ionicHistory, ShowMessageSrv, GetUri, profileService){
    console.log('Inicia ... SearchCategoryUser');

    $scope.showMessage = ShowMessageSrv;

    $scope.model = {
        searchText: "",
        users: [],
        page: 1,
        moreData: false
    }

    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $scope.unknown_post = url_post;

    $scope.back = function(){ $ionicHistory.goBack(); }

    $scope.viewProfile = function(profileId){
        profileService.viewprofile(profileId);
    }

    $scope.updateData = function() {
        $scope.model.page = 1;
        $scope.model.users = [];
        var uri = GetUri(api.user.search, {
            interestid: $stateParams.id,
            limit: 5,
            orderby: "followers desc",
            page: $scope.model.page
        });

        Exec(uri);
    };
    $scope.search = function() {
        $scope.model.page = 1;
        $scope.model.users = [];
        var query = { interestid: $stateParams.id, orderby: "followers desc", limit: 5, page: $scope.model.page };

        if($scope.model.searchText){
            query.texttofind = $scope.model.searchText;
        }

        var uri = GetUri(api.user.search, query);

        Exec(uri);
    };
    $scope.followUser = function(item) {
        $ionicLoading.show();
        $http.post(api.explore.followUser, {
            id: item.profileId
        }).success(function(data, status, headers, config) {
            $scope.model.users.splice($scope.model.users.indexOf(item), 1);
            $ionicLoading.hide();
            $scope.showMessage("Exito", "Solicitud realizada exitosamente!");
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.dir(status);
            $ionicLoading.hide();
            $scope.showMessage("Error", "Ha courrido un error al enviar la solicitud.");
        });
    };
    $scope.loadMore = function() {
        var query = { interestid: $stateParams.id, orderby: "followers desc", limit: 5, page: ++$scope.model.page };
        if($scope.model.searchText){
            query.texttofind = $scope.model.searchText;
        }

        var uri = GetUri(api.user.search, query);

        Exec(uri);
    };

    function Exec(uri){
        $scope.msg = "cargando...";
        $scope.model.moreData = false;
        $http.get( uri )
            .success(function(data, status, headers, config) {
                $scope.model.users = $scope.model.users.concat(data);
                $scope.msg = null;
                $scope.model.moreData = data.length === 1;

                if(0 >= data.length){
                    $scope.msg = "No se han encontrado personas";
                    //Ocultamos el mensaje despues de unos segundos.
                    $timeout(function () {
                        $scope.msg = null;
                    }, 5000);
                }
            }).error(function(data, status, headers, config) {
                console.dir(data);
                console.dir(status);
                $scope.msg = null;
                $scope.showMessage("Error", "Ha ocurrido un error al cargar los usuarios populares");
            });
    }

    (function(){
        var uri = GetUri(api.user.search, { interestid: $stateParams.id, orderby: "followers desc", limit: 5, page: 1 });
        Exec(uri);
    })()
});
