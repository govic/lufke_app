angular.module('lufke').controller('ProfileController', function ($scope, PostsService) {
	console.log('Inicia ... ProfileController');

	$scope.model = {
		backgroundImgUrl: "http://goo.gl/WgH5Ju",
		profileImgUrl: "http://goo.gl/T4xQbr",
		profileFirstName: "Ryan",
		profileLastName: "Sheckler",
		profileId: 1,
		postsNumber: 2093,
		postsUnit: "",
		followersNumber: 5.4,
		followersUnit: "M",
		followingNumber: 204,
		followingUnit: "",
		interests: [
			{
				interestText: "Surfing",
				interestId: 1
			}, {
				interestText: "Hiking",
				interestId: 2
			}, {
				interestText: "Skateboard",
				interestId: 3
			}
		],
		summaryText: "Skateboard fan and I'm from San Clemente",
		tags: [
			{
				tagText :"@Red-Bull",
				tagId: 1
			}, {
				tagText: "Plan B",
				tagId: 2
			}, {
				tagText: "@Etnies",
				tagId: 3
			}
		],
		socialLinkText: "www.socialink.me/ryansheckler",
		socialLinkUrl: "http://www.socialink.me/ryansheckler?origin=lufkeapp",
		lastPosts: []
	};
	
	$scope.$on('$ionicView.afterEnter', function () {
		//TODO: el servicio debe encargarse de actualizar cambios en la lista de noticias
		console.log("Entro a... ProfileController");
		$scope.model.lastPosts = PostsService.getLastUserPosts($scope.model.profileId, 0);
	});

	$scope.editProfile = function (profile) {
		alert("Editar profile id = " + profile.profileId);
	}
	$scope.viewTag = function (tag) {
		alert("Ver detalle tag id = " + tag.tagId);
	}
	$scope.socialLink = function (link) {
		window.open(link, '_system', 'location=yes');
	};
});