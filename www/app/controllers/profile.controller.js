angular.module('lufke').controller('ProfileController', function($localStorage, $ionicLoading, $scope, PostsService, $state, $http, $rootScope) {
    console.log('Inicia ... ProfileController');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $ionicLoading.show();
    $http.post(api.user.getProfile).success(function(profile, status, headers, config) {
        $scope.model = profile;
        if($scope.model.backgroundImgUrl !== null && $scope.model.backgroundImgUrl !== ''){
            $scope.background = $scope.url + $scope.model.backgroundImgUrl;
        }
        else{
            $scope.background = $scope.unknown_background;
        }
        $ionicLoading.hide();
    }).error(function(data, status, headers, config) {
        console.dir(data);
        console.log(status);
        $ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error al cargar sus datos de perfil.");
    });
    $scope.$on('$ionicView.afterEnter', function() {
        //TODO: el servicio debe encargarse de actualizar cambios en la lista de noticias
        console.log("Entro a... ProfileController");
        //$scope.model.lastPosts = PostsService.getLastUserPosts($scope.model.profileId, 0);
    });
    $scope.updateProfileData = function() {
        $http.post(api.user.getProfile).success(function(profile, status, headers, config) {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.model = profile;
            if($scope.model.backgroundImgUrl !== null && $scope.model.backgroundImgUrl !== ''){
                $scope.background = $scope.url + $scope.model.backgroundImgUrl;
            }
            else{
                $scope.background = $scope.unknown_background;
            }
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar sus datos de perfil.");
        });
    };
    $scope.editProfile = function() {
        $state.go('editprofile');
    }
    $scope.viewTag = function(tag) {
        alert("Ver detalle tag id = " + tag.tagId);
    }
    $scope.socialLink = function(link) {
        window.open(link, '_system', 'location=yes');
    };
    $scope.logout = function() {
        $rootScope.$broadcast('logout');
        $state.go('login');
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