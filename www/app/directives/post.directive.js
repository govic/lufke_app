angular.module('lufke')
		.directive('postSummary', function (PageInfoSrv) {
			return {
				restrict: 'E',
				templateUrl: 'app/templates/directives/post-summary.html',
				link: function($scope, element, attrs){
					if($scope.post.backgroundImgUrl !== '' && $scope.post.backgroundImgUrl !== null){
						$scope.post.backgroundImgUrl = url_files + $scope.post.backgroundImgUrl;
					}else{
						$scope.post.backgroundImgUrl = $scope.post.profileBackgroundImgUrl ? url_files + $scope.post.profileBackgroundImgUrl : url_post;
					}

					if($scope.post.text){
						//Busca el id del video alojado en youtube. Retorna null si no lo encuentra.
						var _id = PageInfoSrv.getVideoId( $scope.post.text );

						if(_id){
							var promise = PageInfoSrv.getYoutubeInfo( _id );

							promise.then(function(data){
								if(data.from === "youtube"){
									if(data.items &&
										data.items[0] &&
										data.items[0].snippet &&
										data.items[0].snippet.thumbnails &&
										data.items[0].snippet.thumbnails.high &&
										data.items[0].snippet.thumbnails.high.url){
										$scope.post.backgroundImgUrl = data.items[0].snippet.thumbnails.high.url;
									}
								}
							})
						}
					}
				}
			};
		});
