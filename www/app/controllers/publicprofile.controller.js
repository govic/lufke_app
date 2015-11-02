angular.module('lufke').controller('PublicProfileController', function($rootScope, $ionicLoading, lodash, $scope, $ionicPopup, $http, $stateParams, $state, $ionicHistory, $timeout, ShowMessageSrv, TrackingStatus) {
    console.log('Inicia ... PublicProfileController');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $scope.adn = url_adn;
    $scope.background;

    $scope.disabled = false;
    $scope.btnSeguir = "Seguir";


    $scope.back = function(){
        $ionicHistory.goBack();
    }
    $scope.updateProfileData = function() {
        GetPublicProfile();
    };
    $scope.showMessage = ShowMessageSrv;

    $scope.follow = function(){
        if($scope.model.BeingFollowed){
            var confirm = $ionicPopup.confirm({
                cancelText: "No",
                okText: "Sí",
                template: "¿Estas seguro de dejar de seguir a " + $scope.model.profileFirstName + "?",
                title: "dejar de seguir"
            });
            confirm.then(function(res){
                if(res){
                    $scope.disabled = true;
                    $scope.btnSeguir = "enviando...";
                    $scope.model.BeingFollowed = false;
                    $scope.model.followersUnit--;
                    $http.post(api.notifications.forsakeUser, {
                        id: $stateParams.profileId
                    }).success(function(data, status, headers, config) {
                        $scope.btnSeguir = "SEGUIR";
                        $scope.disabled = false;
                        $rootScope.$emit("user-forsook", $stateParams.profileId);
                    }).error(function(data, status, headers, config) {
                        console.dir(data);
                        console.dir(status);
                        $scope.model.BeingFollowed = true;
                        $scope.model.followersUnit++;
                        $scope.disabled = false;
                        $scope.showMessage("Error", "Ha courrido un error al enviar la solicitud.");
                    });
                }
            });
        }else{
            $scope.disabled = true;
            $scope.btnSeguir = "enviando...";
            $http.post(api.explore.followUser, {
                id: $stateParams.profileId
            }).success(function(data, status, headers, config) {
                if(TrackingStatus.Accepted == data){
                    $scope.model.followersUnit++;
                }
                $scope.btnSeguir = "siguiendo";
                $timeout(function(){
                    $scope.model.BeingFollowed = true;
                }, 3000)
                $scope.disabled = false;
                $rootScope.$emit("following-user", $stateParams.profileId);
            }).error(function(data, status, headers, config) {
                console.dir(data);
                console.dir(status);
                $scope.model.BeingFollowed = false;
                $scope.disabled = false;
                $scope.showMessage("Error", "Ha courrido un error al enviar la solicitud.");
            });
        }
    }

    function GetPublicProfile(){
        $ionicLoading.show();
        $http.post(api.user.getPublicProfile, {
            profileId: $stateParams.profileId
        }).success(function(publicProfile, status, headers, config) {
            $scope.model = publicProfile;

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
            $scope.showMessage("Error", "Ha ocurrido un error al cargar los datos del perfil.");
        });

        $http.get(api.user.interests + "?userId=" + $stateParams.profileId.toString()).success(function(data, status, headers, config) {
            $scope.interests = data || [];
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar los datos del perfil.");
        });
    }

    GetPublicProfile();
});
