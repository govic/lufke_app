angular
.module("lufke")
.controller("SearchInterestController", function($rootScope, $scope, $http, $ionicHistory, lodash, ShowMessageSrv, SelectedCategoriesSrv, OrderByLetter, GetUri){
    var buffer = SelectedCategoriesSrv.get();

    $scope.title = "Agregar Categoría";
    $scope.searchText = "buscando intereses...";
    $scope.placeholder = "buscar categoría";
    $scope.orderBy = "interestText";
    $scope.moreData = false;
    $scope.showMessage = ShowMessageSrv;

    var doneIsDisabled = 0;

    $scope.back = function(){
        $ionicHistory.goBack();
    }
    $scope.doneIsDisabled = function(){
        return false;
    }
    $scope.done = function(){
        SelectedCategoriesSrv.set( buffer );
        $rootScope.$broadcast("new-post-interest-added");
        var $destroy = $scope.$on("$destroy", function(){
            $destroy();
        });
        $ionicHistory.goBack();
    }
    $scope.customTrackFunction = function(interest){
        return interest.interestText;
    }
    $scope.getText = function(interest){
        return interest.interestText;
    }
    $scope.getImage = function(interest){
        return "";
    }

    $scope.toggleSelect = function(interes){
        interes.selected = interes.selected === true ? false : true;
        if(interes.selected === true){
            doneIsDisabled++;
            buffer.push( interes );
        }else{
            doneIsDisabled--;
            var _interest = lodash.find( buffer, function(_interest){
                return _interest.interestId === interes.interestId;
            });
            if(_interest){ buffer.splice(buffer.indexOf( _interest ), 1 ); }
        }
    }
    var uri = GetUri(api.user.getSuggestedInterests, { limit: "", page: "" });
    $http.get(uri, { cache: true }).success(function(data, status, headers, config) {
        //Obtengo los intereses seleccionados.
        var selected = SelectedCategoriesSrv.get();

        //marco como true los seleccionados.
        selected.forEach(function(interest){
            var _interest = lodash.find( data.interests, function(_interest){
                return _interest.interestText === interest.interestText;
            });
            _interest.selected = true;
            doneIsDisabled++;
        });

        //finalmente los ordeno para mostrarlos.
        $scope.dictionary = OrderByLetter( data.interests.concat( [] ), "interestText" );

        $scope.searchText = null;

    }).error(function(err, status, headers, config) {
        console.dir(err);
        console.log(status);
        $scope.showMessage("Error", "Ha ocurrido un error al completar la operación. Revisa tu conexión a internet.");
    });
}).controller("SearchUserController", function($rootScope, $scope, $http, $stateParams, $timeout, $ionicHistory, lodash, ShowMessageSrv, SelectedUsersSrv, OrderByLetter, GetUri){

    var pageNumber = 1;
    var buffer = SelectedUsersSrv.get();

    $scope.title = "Agregar Amigos";
    $scope.searchText = "buscando...";
    $scope.placeholder = "ingresa un texto";
    $scope.orderBy = "profileFirstName";
    $scope.empty = "no se encontraron personas";
    $scope.moreData = false;
    $scope.showMessage = ShowMessageSrv;
    $scope.moreData = true;
    $scope.dictionary = [];

    var doneIsDisabled = 0;

    $scope.back = function(){
        $ionicHistory.goBack();
    }
    $scope.doneIsDisabled = function(){
        return false;
    }
    $scope.done = function(){
        //Confirmamos los cambios.
        SelectedUsersSrv.set( buffer );
        $rootScope.$emit("new-post-friend-added");
        var $destroy = $scope.$on("$destroy", function(){
            $destroy();
        });
        $ionicHistory.goBack();
    }
    $scope.customTrackFunction = function(friend){
        return friend.profileFirstName + " " + friend.profileLastName + " " + friend.profileId.toString();
    }
    $scope.getText = function(friend){
        return friend.profileFirstName + " " + friend.profileLastName;
    }
    $scope.getImage = function(friend){
        return friend.profileImgUrl !== null && friend.profileImgUrl !== '' ? url_files + friend.profileImgUrl : url_user;
    }
    $scope.toggleSelect = function(user){
        user.selected = user.selected === true ? false : true;
        if(user.selected === true){
            doneIsDisabled++;
            buffer.push( user );
        }else{
            doneIsDisabled--;
            var _user = lodash.find( buffer, function(_user){
                return _user.profileId === user.profileId;
            });
            if(_user) buffer.splice(buffer.indexOf( _user ), 1 );
        }
    }
    $scope.loadMoreData = function(){
        loadFriends(pageNumber++);
    }
    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMoreData();
  });

    function loadFriends(_page, fc){
        var _fc = fc || function(){};

        var uri = GetUri(api.user.friends, { limit: 15, page: _page, orderby: "firstname", userid: $stateParams.profileid });

        $http.get(uri, { cache: true }).success(function(data, status, headers, config) {
            if(!data || 0 >= data.length){
                $scope.moreData = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return;
            }

            //Obtengo los intereses seleccionados.
            var selected = SelectedUsersSrv.get();

            //marco como true los seleccionados.
            selected.forEach(function(user){
                var _user = lodash.find( data, function(_user){
                    return _user.profileId === user.profileId;
                });
                _user.selected = true;
                doneIsDisabled++;
            });


            //finalmente los ordeno para mostrarlos.
            var _data = OrderByLetter( data.concat( [] ), "profileFirstName" );

            //Si existen datos previamente y si existen nuevos datos para agregar, se agregan :P
            if($scope.dictionary.length > 0 && _data.length > 0){
                //Si alguno de los nuevos datos pertenece a una letra ya mostrada en la lista
                if($scope.dictionary[$scope.dictionary.length - 1].letra == _data[0].letra){
                    $scope.dictionary[$scope.dictionary.length - 1].array = $scope.dictionary[$scope.dictionary.length - 1].array.concat(_data[0].array);
                }else{
                    $scope.dictionary = $scope.dictionary.concat(_data);
                }
            }else{
                //Si no, solo se agregan los datos nuevos.
                $scope.dictionary = _data;
            }

            $scope.searchText = null;

            $scope.$broadcast('scroll.infiniteScrollComplete');

        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al completar la operación. Revisa tu conexión a internet.");
        });
    }
}).factory("OrderByLetter", function(){
    return function Order(items, attribute){
        var index = {}

        items.forEach(function(item){
            var letra = item[attribute].charAt(0);

            if(!index[letra]){
                index[letra] = [];
            }
            index[letra].push( item );
        });

        var _array = [];

        for(var letra in index){
            _array.push( { letra: letra, array: index[letra] } );
        }
        return _array;
    };
});
