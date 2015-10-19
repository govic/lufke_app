angular.module('lufke').controller('StartController', function ($rootScope, $scope, $state, $timeout, $localStorage, $http, UserInterestsSrv, ShowMessageSrv) {
	console.log('Inicia ... StartController');
	//TODO: borrar esto y hacerlo de forma correcta

	$scope.showMessage = ShowMessageSrv;

	//Si existen credenciales, redirigir desde acá, para que no se vea el login.
	if($localStorage.basic && $localStorage.basic.trim() != "") {
		var credentialsHash = $localStorage.basic.split(" ")[1];

		$http.post(api.user.login, {
			credentialsHash: credentialsHash
		})
		.success(function LoginDone(user, status, headers, config) {
	        var auth = 'Basic ' + user.credentialsHash;
	        $http.defaults.headers.common.Authorization = auth; //cabecera auth por defecto
	        $localStorage.basic = auth; //guarda cabecera auth en var global localstorage
	        $localStorage.session = user.id; //guarda id usuario para consultas - global localstorage
			$localStorage.public = user.publicProfile;

	        /* if (ionic.Platform.platform() != "win32") {
	            $cordovaPush.register({ "senderID": "767122101153" });
	        } */

	        UserInterestsSrv.get();

	        $rootScope.$emit("profile-updated");

	        $state.go('tab.news'); //redirige hacia news
	    })
		.error(function Error(err, status, headers, config) {
			console.dir(err);
			console.log(status);
			$http.defaults.headers.common.Authorization = null;
			$localStorage.session = null;
			$localStorage.basic = null;
			$localStorage.public = null;

			if (status == 500) $scope.showMessage("Error", "El nombre de usuario o la contraseña no son correctos.");
			else $scope.showMessage("Error", "No es posible contactar con el servidor en estos momentos, por favor intente más tarde.");
		});
	}else{
		$timeout(function timeout() {
			//will be directed to / after 3 seconds.
			$state.go('login');
		}, 2000);
	}

});
