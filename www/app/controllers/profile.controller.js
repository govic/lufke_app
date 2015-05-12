angular.module('lufke').controller('ProfileController', function($scope, PostsService, $state, $http) {
    console.log('Inicia ... ProfileController');
    $http.post(api.user.getProfile)
    .success(function(profile, status, headers, config) {
        $scope.model = profile;
    }).error(function(data, status, headers, config) {
        console.dir(data);
        console.log(status);
        $scope.showMessage("Error", "Ha ocurrido un error al cargar sus datos de perfil.");
    });
    $scope.$on('$ionicView.afterEnter', function() {
        //TODO: el servicio debe encargarse de actualizar cambios en la lista de noticias
        console.log("Entro a... ProfileController");
        //$scope.model.lastPosts = PostsService.getLastUserPosts($scope.model.profileId, 0);
    });
    $scope.editProfile = function(id) {
    	$scope.model.backgroundImgUrl = "http://www.car-vs-car.de/images/resized/Toyota-Celica-GTS-Vngr.jpg";
    	//$state.go('editprofile');
    }
    $scope.viewTag = function(tag) {
        alert("Ver detalle tag id = " + tag.tagId);
    }
    $scope.socialLink = function(link) {
        window.open(link, '_system', 'location=yes');
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