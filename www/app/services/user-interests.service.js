angular.module("lufke")
.factory("UserInterestsSrv", function($q, $http){
    return new function(){
        var self = this;
        var cargado = null; //Si esta nulo, no se ha terminado de obtener los intereses.
        var _data = null;
        var userid = null;

        //Creamos una promesa en caso de que se consulte antes de terminar la consulta.
        var deffered = $q.defer();
        var promise = deffered.promise;
        var stack = [];
        promise.then(function(data){
            stack.forEach(function(_deffered){
                _deffered.resolve(data);
            });
        }, function(err){
            stack.forEach(function(_deffered){
                _deffered.reject(err);
            });
        });

        //Consultamos por los intereses del usuario.
        Query(deffered);

        self.setUserId = function(_userid){
            userid = _userid;
        }
        self.add = function(item){
            var _deffered = $q.defer();

            if(userid === null){
                _def.reject(new Error("userid no ha sido definido"));
            }

            $http.post(api.user.addInterestToProfile, {
                interestId: item.interestId
            }).success(function(data, status, headers, config) {
                //Agregamos el nuevo interes al principio de la coleccion.
                _data.unshift( data );
                //Gatillamos el evento "resolve" (exito) de la promise.
                _deffered.resolve( data );
            }).error(function(err, status, headers, config) {
                //Gatillamos el evento "reject" (error) de la promise.
                _deffered.reject( err );
                console.dir(err);
                console.log(status);
            });

            return _deffered.promise;
        }
        self.remove = function(interest){
            var deferred = $q.defer();
            var index = _data.indexOf( interest );

            if(userid === null){
                _def.reject(new Error("userid no ha sido definido"));
            }

            $http.post(api.user.deleteInterest, {
                interestId: interest.interestId
            }).success(function(data){
                deferred.resolve(data);
            }).error(function(err, status, headers, config) {
                deferred.reject(err);
                //Si ocurre un error, volvemos a insertar el elemento eliminado.
                _data.splice( index, 0, interest );
                console.dir(err);
                console.log(status);
            });
            //El elemento lo eliminanos de inmediato, no esperamos la respuesta del servidor.
            _data.splice( index, 1 );

            return deferred.promise;
        }
        self.get = function(){
            var _def = $q.defer();

            if(userid === null){
                _def.reject(new Error("userid no ha sido definido"));
            }

            //Si los intereses del usuario aun no han sido cargados, insertamos una promesa en el stack;
            if(cargado === null){
                stack.push( _def );
            }
            //Si ocurrio un error al consultar por los intereses, consultamos de nuevo.
            if(cargado === false){
                Query( _def );
            }
            //Si los intereses estan cargados, creamos una promese y la resolvemos de inmediato;
            if(cargado === true){
                _def.resolve( _data );
            }

            return _def.promise;
        }
        self.reset = function(){
            cargado = false;
            _data = null;
        }

        function Query(_def){
            if(!userid) return;
            $http.get(api.user.interests + "?userId=" + userid.toString()).success(function(data, status, headers, config) {
                cargado = true;
                _data = data ? data : [];
                _def.resolve(data);
            }).error(function(err, status, headers, config) {
                cargado = false;
                console.dir(err);
                console.log(status);
                _def.reject(err);
            });
        }
    }
});
