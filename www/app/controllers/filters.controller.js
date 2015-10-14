angular.module('lufke').controller('FiltersController', function($rootScope, $ionicHistory, $ionicLoading, $scope, $ionicPopup, $http, $state, ShowMessageSrv, FilterInterests, SelectedCategoriesSrv){
    console.log('Inicia ... FiltersController');

    $scope.index = 3;
    $scope.interests = FilterInterests.interests.concat( [] );
    $scope.proportions = {};

    $scope.photosChanged = function(){
        $scope.proportions.photos = parseInt($scope.proportions.photos);

        $scope.proportions.videos = 100 - $scope.proportions.photos - $scope.proportions.links;
        if($scope.proportions.videos < 0){
            $scope.proportions.links += $scope.proportions.videos;
            $scope.proportions.videos = 0;
        }

        if($scope.proportions.links > 0 && $scope.proportions.videos === 0){
            $scope.proportions.links =  100 - $scope.proportions.photos;
            if($scope.proportions.links < 0){
                $scope.proportions.links = 0;
            }
        }
    };
    $scope.videosChanged = function(){
        $scope.proportions.videos = parseInt($scope.proportions.videos);

        $scope.proportions.links =  100 - $scope.proportions.videos - $scope.proportions.photos;
        if($scope.proportions.links < 0){
            $scope.proportions.photos += $scope.proportions.links;
            $scope.proportions.links = 0;
        }

        if($scope.proportions.photos > 0 && $scope.proportions.links === 0){
            $scope.proportions.photos =  100 - $scope.proportions.videos;
            if($scope.proportions.photos < 0){
                $scope.proportions.photos = 0;
            }
        }
    };
    $scope.linksChanged = function(){
        $scope.proportions.links = parseInt($scope.proportions.links);

        $scope.proportions.photos =  100 - $scope.proportions.links - $scope.proportions.videos;
        if($scope.proportions.photos < 0){
            $scope.proportions.videos += $scope.proportions.photos;
            $scope.proportions.photos = 0;
        }

        if($scope.proportions.videos > 0 && $scope.proportions.photos === 0){
            $scope.proportions.videos =  100 - $scope.proportions.links;
            if($scope.proportions.videos < 0){
                $scope.proportions.videos = 0;
            }
        }
    };

    $scope.proportions.photos = FilterInterests.photos;
    $scope.proportions.videos = FilterInterests.videos;
    $scope.proportions.links = FilterInterests.links;


    if(FilterInterests.editing){
        var _tmp = SelectedCategoriesSrv.get();
        $scope.interests = _tmp.concat([]);
        FilterInterests.editing = false;
        console.log($scope.interests)
    }else{
        SelectedCategoriesSrv.reset();
    }

    //$ionicLoading.show();
    $scope.getImage = function(interest){
        return interest.previewPath ? (url_files + interest.previewPath) : url_post;
    }
    $scope.cancel = function(){
        SelectedCategoriesSrv.reset();
        $ionicHistory.goBack();
    }
    $scope.editInterests = function(){
        FilterInterests.editing = true;
        SelectedCategoriesSrv.reset();
        SelectedCategoriesSrv.set( $scope.interests.concat([]) );
    }
    $scope.updateFiltersData = function() {
        /*$http.post(api.filters.getFilters).success(function(data, status, headers, config) {
            $scope.model = data;
            $scope.$broadcast('scroll.refreshComplete');
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al cargar los filtros y preferencias.");
        });*/
    };
    $scope.saveFilters = function() {
        FilterInterests.interests = $scope.interests.concat([]);

        FilterInterests.photos = $scope.proportions.photos;
        FilterInterests.videos = $scope.proportions.videos;
        FilterInterests.links = $scope.proportions.links;

        $rootScope.$emit("filters-saved");
        $state.go("tab.news");
        /*$http.post(api.filters.saveFilters, $scope.model).success(function(data, status, headers, config) {
            $scope.model = data;
            $scope.showMessage("Exito", "Sus preferencias fueron guardadas exitosamente.");
        }).error(function(err, status, headers, config) {
            console.dir(err);
            console.log(status);
            $scope.showMessage("Error", "Ha ocurrido un error al guardar los filtros y preferencias.");
        });*/
    };
    $scope.showMessage = ShowMessageSrv;

    /*$http.post(api.filters.getFilters).success(function(data, status, headers, config) {
        $scope.model = data;
         $ionicLoading.hide();
    }).error(function(err, status, headers, config) {
        console.dir(err);
        console.log(status);
        $ionicLoading.hide();
        $scope.showMessage("Error", "Ha ocurrido un error al cargar los filtros y preferencias.");
    });*/
    var $destroy = $scope.$on("$destroy", function(){
        $destroy();
        //SelectedCategoriesSrv.reset();
    });
})
.factory("FilterInterests", function(){
    return {
        editing: false,
        interests: [],
        photos: 33,
        videos: 33,
        links: 33,
        reset: function(){
            this.editing = false;
            this.interests = [];
            this.photos = 33;
            this.videos = 33;
            this.links = 33;
        }
    };
});
