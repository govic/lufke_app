angular.module('lufke').controller('AllNotificationsController', function($ionicLoading, lodash, $state, $scope, $ionicPopup, $http) {
    console.log('Inicia ... AllNotificationsController');
    $scope.url = url_files;
    $scope.unknown_user = url_user;
    $scope.moreData = true;
    var full_notification = 0;
    var full_notification_aux = 0;
    $ionicLoading.show();
    $http.post(api.notifications.getAllNotifications).success(function(data, status, headers, config) {
        $scope.model = data;
        $ionicLoading.hide();
    }).error(function(err, status, headers, config) {
        console.dir(err);
        console.log(status);
        $ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error al cargar la lista de notificaciones.");
    });
    $scope.updateData = function() {
        $http.post(api.notifications.getAllNotifications).success(function(data, status, headers, config) {
            $scope.model = data;
            $scope.$broadcast('scroll.refreshComplete');
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar la lista de notificaciones.");
        });
    };
    $scope.viewNotification = function(notification) {//TODO falta link hacia post o perfil usuario
        console.dir(notification);
        if (notification.notificationType === "Like" || notification.notificationType === "Comment") {
            $state.go('post', {
                postId: notification.postId
            });
        } else if (notification.notificationType === "Tracking") {
            $state.go('publicprofile', {
                profileId: notification.profileId
            });
        }
    };
    $scope.moreNotifications = function() {
        console.log("moreNotifications");
        var last = lodash.last($scope.model.notificationsList);
        console.dir(last);
        full_notification = $scope.model.notificationsList.length;
        console.log(full_notification);
        $http.post(api.notifications.getAllNotifications, {
            lastId: last.notificationId,
            lastTimestamp: last.timestamp
        }).success(function(data, status, headers, config) {
            lodash.forEach(data.notificationsList, function(item) {
                $scope.model.notificationsList.push(item);
            });
            full_notification_aux = $scope.model.notificationsList.length;
            console.log(full_notification_aux);
            if (full_notification === full_notification_aux) $scope.moreData = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar notificaciones anteriores.");
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
    $scope.viewDetail = function(item){
        if(item.notificationType === "Mentioned"){
            $state.go("post", {'postId': item.postId});
        }
    }
});
