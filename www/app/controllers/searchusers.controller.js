angular.module('lufke').controller('SearchUsersController', function(lodash, $rootScope, $scope, $http, $ionicLoading, $ionicHistory, $timeout, ShowMessageSrv, profileService) {
    console.log('Inicia ... SearchUsersController');

    $scope.showMessage = ShowMessageSrv;

    $scope.model = {
        searchText: "",
        users: [],
        page: 0,
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
        $scope.model.moreData = false;
        $http.post(api.explore.getSearchUsers, {
            page: 0
        }).success(function(data, status, headers, config) {
            $scope.msg = null;
            $scope.model = data;
            $scope.model.moreData = data.users.length > 0;

            if(0 >= data.users.length){
                $scope.msg = "No se han encontrado personas";
                //Ocultamos el mensaje despues de unos segundos.
                $timeout(function () {
                    $scope.msg = null;
                }, 5000);
            }

            $scope.$broadcast('scroll.refreshComplete');
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.dir(status);
            $scope.msg = null;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.showMessage("Error", "Ha ocurrido un error al cargar los usuarios populares.");
        });
    };
    $scope.search = function() {
        $scope.msg = "buscando...";
        $scope.model.moreData = false;
        $http.post(api.explore.getSearchUsers, {
            page: 0, //siempre la busqueda se hace por primera pagina
            searchText: $scope.model.searchText
        }).success(function(data, status, headers, config) {
            $scope.msg = null;
            $scope.model = data;
            $scope.model.moreData = data.users.length > 0;

            if(0 >= data.users.length){
                $scope.msg = "No se han encontrado personas";
                //Ocultamos el mensaje despues de unos segundos.
                $timeout(function () {
                    $scope.msg = null;
                }, 5000);
            }
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.dir(status);
            $scope.msg = null;
            $scope.showMessage("Error", "Ha ocurrido un error al realizar la búsqueda solicitada.");
        });
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
        $scope.msg = "cargando...";
        $scope.model.moreData = false;
        $http.post(api.explore.getSearchUsers, {
            page: ++$scope.model.page, //una pagina mas
            searchText: $scope.model.searchText
        }).success(function(data, status, headers, config) {
            $scope.msg = null;
            if (data.users && data.users.length > 0) {
                $scope.model.moreData = true;
                $scope.model.page = data.page;
                lodash.forEach(data.users, function(item) { //agrega todos mas usuarios encontrados
                    $scope.model.users.push(item);
                    console.dir($scope.model.users);
                    $scope.model.users = lodash.uniq($scope.model.users, 'profileId');
                });
                $ionicLoading.hide();
            } else {
                $ionicLoading.hide();
                $scope.model.moreData = false;
                $scope.msg = "No se han encontrado más personas";

                //Ocultamos el mensaje despues de unos segundos.
                $timeout(function () {
                    $scope.msg = null;
                }, 5000);
            }
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.dir(status);
            $scope.msg = null;
            $scope.showMessage("Error", "Ha ocurrido un error al realizar la búsqueda solicitada.");
        });
    };

    var followingUser = $rootScope.$on("following-user", Load);
    var destroy = $rootScope.$on("$destroy", function(){
        destroy();
        followingUser();
    });

    function Load(){
        $scope.msg = "buscando...";
        $http.post(api.explore.getSearchUsers, {
            page: 0
        }).success(function(data, status, headers, config) {
            $scope.msg = null;

            $scope.model = data;
            $scope.model.moreData = data.users.length > 0;

            if(0 >= data.users.length){
                $scope.msg = "No se han encontrado personas";
                //Ocultamos el mensaje despues de unos segundos.
                $timeout(function () {
                    $scope.msg = null;
                }, 5000);
            }
        }).error(function(err, status, headers, config) {
            $scope.msg = null;
            console.dir(err);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar los usuarios populares.");
        });
    }

    Load();
});
