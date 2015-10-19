angular.module('lufke').controller('RegisterController', function($ionicHistory, $state, $localStorage, $scope, $http, $base64, $ionicPopup, ImagesPath, ShowMessageSrv, GetUri, SelectedCategoriesSrv, RegisterData) {
    console.log('Inicia ... RegisterController');

    $scope.showMessage = ShowMessageSrv;

    $scope.loginImage = ImagesPath.login;
    //elimina datos sesion usuario activo
    $localStorage.session = null;
    $localStorage.basic = null;
    $localStorage.public = null;
    $http.defaults.headers.common.Authorization = null;
    var registerForm = null;

    $scope.registerForm = {};
    var _form = null;

    $scope.$watch("registerForm.form", function(newValue){
        _form = newValue;
    });

    $scope.registrarText = "Regístrame";

    $scope.model = {
        name: RegisterData.userName,
        nameError: null,
        email: RegisterData.email,
        emailError: null,
        password: RegisterData.passwordHash,
        passwordError: null,
        passwordVerify: RegisterData.RepeatPasswordHash,
        passwordVerifyError: null
    };
    $scope.formInvalid = true;

    $scope.validateEmail = function($form){
        $scope.model.emailError = null;

        if($form.registerEmail.$invalid) return;

        $http.get(GetUri( api.user.validateEmail, { email: $scope.model.email } ))
            .success(function(data){
                if(data){
                    $scope.model.emailError = data;
                    return InvalidForm($form, "registerEmail");
                }
                FormIsValid($form);
            })
            .error(function(data){
                $scope.showMessage("Error", "¡Ups!, ha ocurrido un error. Por favor intenta más tarde.");
                $scope.model.emailError = null;
            });
    }
    $scope.validateUserName = function($form){
        $scope.model.nameError = null;

        if($form.registerName.$invalid) return;

        if(!$scope.model.name || 0 >= $scope.model.name.length || 6 > $scope.model.name.length){
            $scope.model.nameError = "debe tener mínimo 6 caracteres";
            return InvalidForm($form, "registerName");
        }
        if(!/^[a-zA-Z0-9\-\.]{6,}$/.test($scope.model.name)){
            $scope.model.nameError = "caracteres válidos son letras, números, - o . ";
            return InvalidForm($form, "registerName");
        }

        $http.get(GetUri( api.user.validateUserName, { userName: $scope.model.name } ))
            .success(function(data){
                if(data){
                    $scope.model.nameError = data;
                    return InvalidForm($form, "registerName");
                }
                FormIsValid($form);
            })
            .error(function(data){
                $scope.showMessage("Error", "¡Ups!, ha ocurrido un error. Por favor intenta más tarde.");
                $scope.model.nameError = null;
            });
    }
    $scope.validatePassword = function($form){
        $scope.model.passwordError = null;

        if($form.registerPassword.$invalid) return;

        if(!$scope.model.password || 0 >= $scope.model.password.length || 6 > $scope.model.password.length){
            $scope.model.passwordError = "debe tener mínimo 6 caracteres";
            return InvalidForm($form, "registerPassword");
        }
        if(!/^[a-zA-Z0-9\-\.]{6,}$/.test($scope.model.password)){
            $scope.model.passwordError = "caracteres válidos son letras, números, - o . ";
            return InvalidForm($form, "registerPassword");
        }
        FormIsValid($form);
    }
    $scope.validatePasswordVerify = function($form){
        $scope.model.passwordVerifyError = null;

        if($form.registerPasswordVerify.$invalid) return;

        if(!$scope.model.passwordVerify || 0 >= $scope.model.passwordVerify.length || 6 > $scope.model.passwordVerify.length){
            $scope.model.passwordVerifyError = "debe tener mínimo 6 caracteres";
            return InvalidForm($form, "registerPasswordVerify");
        }
        if(!/^[a-zA-Z0-9\-\.]{6,}$/.test($scope.model.passwordVerify)){
            $scope.model.passwordVerifyError = "caracteres válidos son letras, números, - o . ";
            return InvalidForm($form, "registerPasswordVerify");
        }

        if($scope.model.passwordVerify !== $scope.model.password){
            $scope.model.passwordVerifyError = "no coincide con la contraseña";
            return InvalidForm($form, "registerPasswordVerify");
        }
        FormIsValid($form);
    }
    $scope.next = function($event){
        FormIsValid(_form);
        if($scope.formInvalid){
            $event.preventDefault();
        }
    }
    $scope.resetRegisterData = function(){
        RegisterData.reset();
        SelectedCategoriesSrv.reset();
    }

    function FormIsValid($form){
        var fields = ["registerPasswordVerify", "registerPassword", "registerName", "registerEmail"];
        var valid = true;
        fields.forEach(function(field){
            valid = valid && $form[field].$valid;
            $form[field].$touched = true;
        });
        $scope.formInvalid = !valid;

        if(valid){
            RegisterData.userName = $scope.model.name;
            RegisterData.email = $scope.model.email;
            RegisterData.passwordHash = $scope.model.password;
            RegisterData.RepeatPasswordHash = $scope.model.passwordVerify;
        }
    }

    function InvalidForm($form, field){
        $form[field].$invalid = true;
        $form[field].$valid = false;
        $form.$invalid = true;
        $form.$valid = false;

        $scope.formInvalid = $form.$invalid;
    }
})
.controller("PersonalInfoController", function($scope, RegisterData, $ionicActionSheet, ShowMessageSrv){
    var _form = null;

    $scope.register = {};
    $scope.model = {
        name: RegisterData.FirstName,
        lastname: RegisterData.LastName,
        bio: RegisterData.SocialLinkText,
        type: RegisterData.UserType || "Persona"
    }

    $scope.$watch("register.form", function(newValue){
        _form = newValue;
    });
    $scope.backgroundImage = RegisterData.BackgroundImage ? "data:image/jpeg;base64," + RegisterData.BackgroundImage.imageBase64 : url_background;
    $scope.profileImage = RegisterData.ProfileImage ? "data:image/jpeg;base64," + RegisterData.ProfileImage.imageBase64 : url_user;
    $scope.showMessage = ShowMessageSrv;
    $scope.next = function($event){
        var fields = ["name", "bio"];
        var valid = true;
        fields.forEach(function(field){
            valid = valid && _form[field].$valid;
            _form[field].$touched = true;
        });
        valid = valid && ($scope.model.type === "Persona" || $scope.model.type === "Compañía");

        if(valid){
            RegisterData.FirstName = $scope.model.name;
            RegisterData.LastName = $scope.model.type === 'Persona' ? $scope.model.lastname : null;
            RegisterData.SocialLinkText = $scope.model.bio;
            RegisterData.UserType = $scope.model.type;
        }

        if(!valid){
            $event.preventDefault();
        }
    }
    $scope.showImagesOptions = function(imageType){
        var hideSheet = $ionicActionSheet.show({
            buttons: [{
                text: '<i class="ion-share"></i> <span>Photo</span>'
            }, {
                text: '<i class="ion-flag"></i> <span>Gallery</span>'
            }],
            cancelText: 'Cancelar',
            cancel: function() {},
            buttonClicked: function(index) {
                //console.log("presionado botón nro: " + index);
                switch (index) {
                    case 0:
                        GetPhoto(navigator.camera.PictureSourceType.CAMARA, imageType);
                        break;
                    case 1:
                        GetPhoto(navigator.camera.PictureSourceType.PHOTOLIBRARY, imageType);
                        break;
                    default:
                        $scope.showMessage("Error", "Un error desconocido ha ocurrido.");
                        break;
                }
                return true;
            }
        });
    }
    function GetPhoto(source, imageType) {
        var options = {
            allowEdit: false,
            correctOrientation: true,
            destinationType: navigator.camera.DestinationType.DATA_URL, //DATA_URL,FILE_URI
            encodingType: navigator.camera.EncodingType.JPEG, //PNG,JPEG
            quality: 75,
            sourceType: source //CAMARA,PHOTOLIBRARY,SAVEDPHOTOALBUM
            //targetWidth: 420,
            //targetHeight: 420
        };
        navigator.camera.getPicture(function(imageBase64) {
            var image = {
                imageBase64: imageBase64,
                imageMimeType: "image/jpeg",
                imageType: imageType
            }
            if("background" === imageType){
                RegisterData.BackgroundImage = image;
                $scope.backgroundImage = "data:image/jpeg;base64," + image.imageBase64;
                $scope.$dispac
            }
            if("profile" === imageType){
                RegisterData.ProfileImage = image;
                $scope.profileImage = "data:image/jpeg;base64," + image.imageBase64;
            }
            $scope.$digest();
        }, function(err) {
            console.log(err);
            if(!/cancel/.test(err)) $scope.showMessage("Error", "Error al cargar imagen.");
        }, options);
    };
})
.controller("RegisterInterestController", function($localStorage, $base64, $http, $state, $scope, RegisterData, SelectedCategoriesSrv, ShowMessageSrv, UserInterestsSrv){
    $scope.interests = SelectedCategoriesSrv.get();
    $scope.showMessage = ShowMessageSrv;
    $scope.sending = false;

    $scope.getImage = function(interest){
        return interest.previewPath ? (url_files + interest.previewPath) : url_post;
    }
    $scope.save = function(){
        RegisterData.Interests = SelectedCategoriesSrv.get();
        RegisterData.passwordHash = $base64.encode(unescape(encodeURIComponent(RegisterData.passwordHash)));
        RegisterData.RepeatPasswordHash = $base64.encode(unescape(encodeURIComponent(RegisterData.RepeatPasswordHash)));

        $scope.sending = true;
        $http.post(api.user.register, RegisterData).success(function(user, status, headers, config) {
            var auth = 'Basic ' + user.credentialsHash;
            $scope.sending = false;
            $http.defaults.headers.common.Authorization = auth;//cabecera auth por defecto
            $localStorage.basic = auth;//guarda cabecera auth en var global localstorage
            $localStorage.session = user.id; //guarda id usuario para consultas - global localstorage
            $localStorage.public = user.publicProfile;
            $state.go('tab.news'); //redirige hacia editar perfil
            $scope.showMessage("Registro", "Has sido registrado con éxito. Bienvenido a Lufke");
            SelectedCategoriesSrv.reset();
            UserInterestsSrv.get();
        }).error(function(data, status, headers, config) {
            console.dir(data);
            console.dir(status);
            $scope.sending = false;
            if (status == 404) $scope.showMessage("Error", "El servidor de datos está sin conexión, por favor intente más tarde.");
            else $scope.showMessage("Error", data.ExceptionMessage);
        });
    }
})
.factory("RegisterData", function(){
    return {
        userName: null,
        email: null,
        passwordHash: null,
        RepeatPasswordHash: null,
        FirstName: null,
        LastName: null,
        SocialLinkText: null,
        UserType: null,
        ProfileImage: null,
        BackgroundImage: null,
        Interests: [],
        reset: function(){
            this.userName = null;
            this.email = null;
            this.passwordHash = null;
            this.RepeatPasswordHash = null;
            this.FirstName = null;
            this.LastName = null;
            this.SocialLinkText = null;
            this.UserType = null;
            this.ProfileImage = null;
            this.BackgroundImage = null;
            this.Interests = [];
        }
    }
});
