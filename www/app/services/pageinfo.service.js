angular
.module("lufke")
.factory("PageInfoSrv", function($http, $q, ScanUri){
    return {
        scan: function(text){
            //<meta content="Subscribe to the YouTube Help channel for video tips, tricks an" name="description">

            //Validamos de que sea una url.
            var _match = ScanUri(text);
            if(_match){
                var id = this.getVideoId(_match);
                //Validamos de que sea un link a youtube.
                if(id){
                    return this.getYoutubeInfo(id, _match);
                }else{
                    return this.getPageInfo(_match);
                }
            }
            var deferred = $q.defer();

            deferred.reject(new Error("url no valida"));

            return deferred.promise;
        },
        getVideoId: function(url){
            try{
                var _match = url.match(/(?:https?:\/\/)?y(?:(?:2)|(?:out))u\.be\/.{11}/);

                if(_match){
                    return _match[0].replace(/(https?:\/\/)?y(2|out)u\.be\//, "");
                }else{
                    _match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=.{11}/);
                     if(_match){
                         return _match[0].replace(/(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=/, "");
                    }
                }
                return null;
            }catch(e){
                console.log(e);
                return null;
            }
            return null;
        },
        getPageInfo: function(url){
            var deferred = $q.defer();

            if(url){
                $http.get(api.post.pageInfo.replace(":url", url)).success(function(data){
                    data.from = "other";
                    data.url = url;
                    deferred.resolve(data);
                }).error(function(err){
                    deferred.reject(err);
                });
            }else{
                deferred.reject(new Error("url no válida."));
            }

            return deferred.promise;
        },
        getYoutubeInfo: function(id, url){
            var deferred = $q.defer();

            if(id){
                $http.get(api.post.videoInfo.replace(":id", id)).success(function(data){
                    data = angular.fromJson(data);
                    data.from = "youtube";
                    data.url = url;
                    deferred.resolve(data);
                }).error(function(err){
                    deferred.reject(err);
                });

            }else{
                deferred.reject(new Error("id de video no válido."));
            }
            return deferred.promise;
        }
    }
})
.factory("ScanUri", function(){
    return function(text){
        var _match = text.match(/(?:https?:\/\/)?[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-]+(?:(?:\.[a-zA-Z0-9\-]{1,}){1,})?(?::[0-9]{1,5})?(?:\/[^\s]*)?/);

        if(_match){
            return _match[0] || null;
        }
    }
});
