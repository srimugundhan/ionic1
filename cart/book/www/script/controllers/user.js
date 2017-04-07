angular.module('bookmycart')
    .controller('LoginController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $cordovaToast, Login, SOCIAL_APP, $cordovaOauth, FBME) {
        $scope.loginSubmit = function($valid, data) {
            if ($valid) {
                showLoading($ionicLoading);
                Login.post(data, function(response) {
                    hideLoading($ionicLoading);
                    console.log(response);
                    if (response.status === true) {
                        storeLocal('accesstoken', response.data.access_token);
                        storeLocal('bookmycartauth', JSON.stringify(response.data));
                        toast($cordovaToast, 'Login Success', 'long', 'center');
                        $state.go('menu.Home');
                    } else {
                        toast($cordovaToast, 'Login Failed', 'long', 'center');
                    }
                }, function(error) {
                    hideLoading($ionicLoading);
                    console.log('In Login error', error);
                })
            }
        };

        $scope.socialLogin = function(stype) {
            if (stype === 'FB') {
                showLoading($ionicLoading);
                var fbscopeString = SOCIAL_APP.Facebook.SCOPE;
                var fbscopes = fbscopeString.split(',');
                $cordovaOauth.facebook(SOCIAL_APP.Facebook.APPID, fbscopes, {
                    redirect_uri: SOCIAL_APP.Facebook.REDIRECT
                }).then(function(success) {
                    console.log(success);
                    hideLoading($ionicLoading);
                    storeLocal('fbtoken', success.access_token);
                    FBME.get(function(response) {
                        console.log(response);
                        toast($cordovaToast, 'Profile Received Under Working', 'long', 'center');
                    }, function(error) {
                        console.log(error);
                    })
                }, function(error) {
                    hideLoading($ionicLoading);
                    console.log('social fb', error);
                });
            }

        };
    })
    .controller('RegisterController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $cordovaToast, Register) {
        $scope.registeSubmit = function($valid, data) {
            if ($valid) {
                showLoading($ionicLoading);
                Register.post(data, function(response) {
                    hideLoading($ionicLoading);
                    console.log(response);
                    if (response.status === true) {
                        storeLocal('accesstoken', response.data.access_token);
                        storeLocal('bookmycartauth', JSON.stringify(response.data));
                        toast($cordovaToast, 'Register Success', 'long', 'center');
                        $state.go('menu.Home', {}, {
                            reload: true
                        });
                    } else {
                        toast($cordovaToast, response.message, 'long', 'center');
                    }
                }, function(error) {
                    hideLoading($ionicLoading);
                    console.log('In RegisterController error', error);
                })
            }
        };
    })
    .controller('ForgotController', function($scope, $rootScope, $state, $ionicLoading, $cordovaDialogs, Forgot) {
        $scope.forgotSubmit = function($valid, data) {
            if ($valid) {
                showLoading($ionicLoading);
                Forgot.post(data, function(response) {
                    hideLoading($ionicLoading);

                    if (response.status === true) {
                        ionicDialog($cordovaDialogs, 'Success', 'New password sent your mail.', 'Ok');
                        $state.go('menu.Login');
                    } else {
                        ionicDialog($cordovaDialogs, 'Failed', 'Checkyour mail id.', 'Ok');
                    }
                }, function(error) {
                    hideLoading($ionicLoading);
                    console.log('In Forgot error', error);
                })
            }
        };
    })
    .controller('ChangePwdController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup, ChangePwd) {
        $scope.pwdSubmit = function($valid, data) {
            if ($valid) {
                showLoading($ionicLoading);
                Login.post(data, function(response) {
                    hideLoading($ionicLoading);
                    console.log(response);
                }, function(error) {
                    hideLoading($ionicLoading);
                    console.log('In ChanPwd error', error);
                })
            }
        };
    })
    .controller('ProfileController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $cordovaToast, Profile) {
        $scope.data = [];
        Profile.get(function(response) {
            showLoading($ionicLoading);
            if (response.status === true) {
                hideLoading($ionicLoading);
                $scope.data = response.data;
                $scope.data.telephone = parseInt(response.data.telephone);
            } else {
                hideLoading($ionicLoading);
            }
        }, function(error) {
            hideLoading($ionicLoading);
            console.log('In ProfileController error', error);
        })
        $scope.profileUpdate = function($valid, data) {
            if ($valid) {
                showLoading($ionicLoading);
                Profile.post(data, function(response) {
                    hideLoading($ionicLoading);
                    storeLocal('accesstoken', response.data.access_token);
                    storeLocal('bookmycartauth', JSON.stringify(response.data));
                    toast($cordovaToast, 'Profile Updated', 'long', 'center');
                    console.log(response);
                }, function(error) {
                    hideLoading($ionicLoading);
                    console.log('In Login error', error);
                })
            }
        };
    })