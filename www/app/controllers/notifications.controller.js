angular.module('lufke').controller('NotificationsController', function($scope, $http, $ionicPopup) {
    console.log('Inicia ... NotificationsController');
    $http.post(api.notifications.getNotifications).success(function(data, status, headers, config) {
        $scope.model = data;
    }).error(function(data, status, headers, config) {
        console.dir(data);
        console.dir(status);
        $scope.showMessage("Error", "Ha ocurrido un error al cargar las notificaciones.");
    });
    /* Metodo para control de requests */
    //metodo que realiza la logica para ignorar una solicitud
    $scope.ignoreRequest = function(request) {
        alert("Solicitud ingnorada id = " + request.requestId);
    };
    //metodo que realiza la logica para aceptar una solicitud
    $scope.acceptRequest = function(request) {
        alert("Solicitud aceptada id = " + request.requestId);
    };
    //metodo cargar todas las requests
    $scope.viewRequests = function() {
        alert("Ver más requests!");
    };
    /* Metodos para control de notifications */
    //metodo cargar todas las notificaciones
    $scope.viewNotifications = function() {
        alert("Ver más notifications!");
    };
    //metodo para redirigir haca notificacion
    $scope.viewNotification = function(notification) {
        alert("Ver notificacion id = " + notification.notificationId);
    };
    //mensajes de alerta
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