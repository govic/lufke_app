angular
.module("lufke")
.controller("CategoryProfileController", function($stateParams, $http, $scope, $ionicLoading, $ionicHistory, ShowMessageSrv){

    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;

    $scope.showMessage = ShowMessageSrv;

    //Consultar datos (nombre, ranking, cantidad de posts, cantidad de seguidores)
    $scope.interest = {
        name: "Hiking",
        ranking: 1,
        posts: 50173,
        followers: 38768453
    };

    $scope.back = function(){ $ionicHistory.goBack(); }

    //Consultar usuarios destacados (estos no son los usuarios destacados para la categoría, hay que implementar el servicio).
    $ionicLoading.show();
    $http.post(api.explore.getPopulars)
    .success(function(data, status, headers, config) {
        $scope.populars = data.topUsers;
        $ionicLoading.hide();
    }).error(function(data, status, headers, config) {
        console.dir(data);
        console.dir(status);
        $ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error. Revisa tu conexión a internet.");
    });

    //Consultar posts populares

    return;

    $http.get(api.interest.get.replace(":id", $stateParams.interestId)).succes(function(profile, status, headers, config){

    }).error(function(data, status, headers, config){
        console.log(data);
        console.log(header);
        $scope.showMessage("Error", "Ha ocurrido un error. Revisa tu conexión a internet.");
    });

});
