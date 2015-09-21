angular.module('lufke').controller('ProfileController', function(lodash, $ionicHistory, $localStorage, $ionicLoading, $scope, PostsService, $state, $http, $rootScope, $ionicPopup, UserInterestsSrv){

	var self = this;

    console.log('Inicia ... ProfileController');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.unknown_background = url_background;
    $scope.adn = url_adn;


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
            GetInterests();
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
		console.log("logout event")
        $localStorage.basic = null;
        $localStorage.session = null;
		$localStorage["login-data"] = null;
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
    $scope.followers = function(){
        $state.go('followers', { userid: $scope.model.profileId });
    }
    $scope.following = function(){
        $state.go('following', { userid: $scope.model.profileId });
    }
    $scope.news = function(){
        $state.go("usernews", { userId: $scope.model.profileId });
    }

	function GetInterests(){
		var promise = UserInterestsSrv.get();

        promise.then(function(data){
            $scope.model.interests = data;
        }, function(err){
			console.log("UserInterestsSrv");
			for(var attr in err){
				console.log(attr)
				console.log(err[attr])
			}
            $scope.showMessage("Error", "Ha ocurrido un error al cargar sus datos de perfil.");
        });
	}

	var $afterEnter = $scope.$on('$ionicView.afterEnter', function() {
        //TODO: el servicio debe encargarse de actualizar cambios en la lista de noticias
        console.log("Entro a... ProfileController");
        //$scope.model.lastPosts = PostsService.getLastUserPosts($scope.model.profileId, 0);
    });
	var $newPost = $rootScope.$on("newPost", function(){
		if($scope.model){
			$scope.model.postsUnit++;
		}
	});
	var $profileUpdated = $rootScope.$on("profile-updated", function(){
		GetProfile();
	});
	var $destroy = $scope.$on("$destroy", function(){
		$afterEnter();
		$destroy()
		$newPost();
		$profileUpdated();
	});

	function GetProfile(){
		$ionicLoading.show();
	    $http.post(api.user.getProfile).success(function(profile, status, headers, config) {
	        delete profile.interests;
	        $scope.model = profile;
	        if($scope.model.backgroundImgUrl !== null && $scope.model.backgroundImgUrl !== ''){
	            $scope.background = $scope.url + $scope.model.backgroundImgUrl;
	        }
	        else{
	            $scope.background = $scope.unknown_background;
	        }
			GetInterests();
	        $ionicLoading.hide();
	    }).error(function(data, status, headers, config) {
	        console.dir(data);
	        console.log(status);
	        $ionicLoading.hide();
	        $scope.showMessage("Error", "Ha ocurrido un error al cargar sus datos de perfil.");
	    });
	}


	GetProfile();
});
