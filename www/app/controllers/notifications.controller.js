angular.module('lufke').controller('NotificationsController', function($ionicLoading, profileService, $scope, $http, $ionicPopup, $state) {
    console.log('Inicia ... NotificationsController');
    $scope.url = url_files;
    $scope.unknown_user = url_unknown;
    $ionicLoading.show();
    $http.post(api.notifications.getNotifications)
    .success(function(data, status, headers, config) {
        $scope.model = data;
        $ionicLoading.hide();
    }).error(function(data, status, headers, config) {
        console.dir(data);
        console.dir(status);
        $ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error al cargar las notificaciones.");
    });
    $scope.updateNotificationsData = function() {
        $ionicLoading.show({
             content: 'Loading',
            animation: 'fade-in',
        })
        $http.post(api.notifications.getNotifications).success(function(data, status, headers, config) {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.model = data;
            $ionicLoading.hide();
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.dir(status);
            $ionicLoading.hide();
            $scope.showMessage("Error", "Ha ocurrido un error al cargar las notificaciones.");
        });
    };
    /* Metodo para control de requests */
    //metodo que realiza la logica para ignorar una solicitud
    $scope.ignoreRequest = function(request) {
        $http.post(api.notifications.ignoreRequest, {
            requestId: request.requestId
        }).success(function(data, status, headers, config) {
            alert("Solicitud ingnorada id = " + request.requestId); //TODO .. falta efectos en la vista
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.dir(status);
            $scope.showMessage("Error", "Ha ocurrido un error al realizar la operación solicitada.");
        });
    };
    //metodo que realiza la logica para aceptar una solicitud
    $scope.acceptRequest = function(request) {
        $http.post(api.notifications.acceptRequest, {
            requestId: request.requestId
        }).success(function(data, status, headers, config) {
            alert("Solicitud aceptada id = " + request.requestId); //TODO .. falta efectos en la vista
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.dir(status);
            $scope.showMessage("Error", "Ha ocurrido un error al realizar la operación solicitada.");
        });
    };
    //metodo cargar todas las requests
    $scope.viewRequests = function() {
        alert("Ver más requests!");
    };
    /* Metodos para control de notifications */
    //metodo cargar todas las notificaciones
    $scope.viewNotifications = function() {
        $state.go('allnotifications');
    };
    //metodo para redirigir haca notificacion
    $scope.viewNotification = function(item) {
        //TODO falta link hacia post o perfil usuario 
        //console.dir(item);  
        $ionicLoading.show();  
        $http.post(api.notifications.revised, {notificationId: item.notificationId})
        .success(function(data, status, headers, config) {
            //console.dir(data);
            $http.post(api.notifications.getNotifications)
            .success(function(data, status, headers, config) {
                //console.dir(data);
                $scope.model = data;
                if(item.notificationType === "Like" || item.notificationType === "Comment"){
                    $state.go('post', {postId: item.postId});
                }
                else if(item.notificationType === "Tracking"){
                    $state.go('publicprofile', {profileId: item.profileId});
                }
                $ionicLoading.hide();
            }).error(function(data, status, headers, config) {
                console.dir(data);
                console.dir(status);
                $ionicLoading.hide();
                $scope.showMessage("Error", "Ha ocurrido un error al cargar las notificaciones.");
            });
            //TODO efecto eliminar de lista
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.dir(status);
            $scope.showMessage("Error", "Ha ocurrido un error al realizar la operación solicitada.");
        });
    };
    $scope.viewProfile = function(requestId){
        profileService.viewprofile(requestId);
    };
    //mensajes de alerta
    $scope.checkNotifications = function() {
        $http.post(api.notifications.check).success(function(data, status, headers, config) {
            //TODO efecto eliminar de lista
            $scope.model.notifications.notificationsList = [];
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.dir(status);
            $scope.showMessage("Error", "Ha ocurrido un error al realizar la operación solicitada.");
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