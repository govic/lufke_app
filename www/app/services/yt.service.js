angular
.module("lufke")
.factory("YoutubeSrv", function($http, $q, yt){
    return {
        yt: yt,
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
        getInfo: function(id){
            var deffered = $q.defer();
            console.log(id)
            if(id){
                $http.get("https://www.googleapis.com/youtube/v3/videos", {
                    params:{
                        id: id,
                        key: yt.appKey,
                        part: "snippet,contentDetails,statistics,status"
                    }
                }).success(function(data){
                    deffered.resolve(data);
                }).error(function(err){
                    deffered.reject(err);
                });

            }else{
                deffered.reject(new Error("id de video no valido."));
            }
            return deffered.promise;
        }
    }
});
