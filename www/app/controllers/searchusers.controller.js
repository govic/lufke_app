angular.module('lufke').controller('SearchUsersController', function(lodash, $scope, $ionicPopup, $http, $ionicLoading) {
    console.log('Inicia ... SearchUsersController');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $scope.unknown_post = url_post;

    $ionicLoading.show();
    $http.post(api.explore.getSearchUsers, {
        page: 0
    }).success(function(data, status, headers, config) {
        $scope.model = data;
        $scope.model.moreData = true;
        $ionicLoading.hide();
    }).error(function(err, status, headers, config) {
        console.dir(err);
        console.dir(status);
        $ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error al cargar los usuarios populares.");
    });
    $scope.updateData = function() {
        $http.post(api.explore.getSearchUsers, {
            page: 0
        }).success(function(data, status, headers, config) {
            $scope.model = data;
            $scope.$broadcast('scroll.refreshComplete');
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.dir(status);
            $scope.$broadcast('scroll.refreshComplete');
            $scope.showMessage("Error", "Ha ocurrido un error al cargar los usuarios populares.");
        });
    };
    $scope.search = function() {
        $ionicLoading.show();
        $http.post(api.explore.getSearchUsers, {
            page: 0, //siempre la busqueda se hace por primera pagina
            searchText: $scope.model.searchText
        }).success(function(data, status, headers, config) {
            $scope.model = data;
            $ionicLoading.hide();
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.dir(status);
            $ionicLoading.hide();
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
        $ionicLoading.show();
        $http.post(api.explore.getSearchUsers, {
            page: $scope.model.page + 1, //una pagina mas
            searchText: $scope.model.searchText
        }).success(function(data, status, headers, config) {
            if (data.users && data.users.length > 0) {
                $scope.model.page = data.page;
                lodash.forEach(data.users, function(item) { //agrega todos mas usuarios encontrados
                    $scope.model.users.push(item);
                    console.dir($scope.model.users);
                    $scope.model.users = lodash.uniq($scope.model.users, 'profileId');                    
                });
                $ionicLoading.hide();
            } else {
                $ionicLoading.hide();
                $scope.showMessage("Mensaje", "No existen mas resultados para mostrar.");
            }
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.dir(status);
            $ionicLoading.hide();
            $scope.showMessage("Error", "Ha ocurrido un error al realizar la búsqueda solicitada.");
        });
    };
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