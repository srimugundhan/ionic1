angular.module('bookmycart')
  .controller('LoginController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $cordovaToast, APIPOST, SOCIAL_APP, $cordovaOauth) {
    $scope.inputType = "password";
    $scope.iconName = "ion-eye";
    $scope.data = {
      email: "atulallme@gmail.com",
      password: "atul@123"
    };
    $scope.loginSubmit = function ($valid, data) {
      if ($valid) {
        data.type = 'login';
        showLoading($ionicLoading);
        APIPOST.post(data, function (response) {
          hideLoading($ionicLoading);
          if (response.success === true) {
            storeLocal('appauth', JSON.stringify(response.data));
            toast($cordovaToast, 'Login Success', 'long', 'bottom');

            APIPOST.post({
              type: 'mycart',
              customer_id: response.data.user_id
            }, function (response) {
              if (response.success === 'true') {
                $rootScope.cartcount = parseInt(response.data.items_count);
              }
            });

            if (window.localStorage.getItem('backurl') !== null) {
              var backurl = getStorage('backurl');
              console.log('backurl', backurl);
              window.localStorage.removeItem('backurl');
              var params = (backurl.params !== undefined) ? backurl.params : '';
              $state.go(backurl.state, params);
            } else {
              $state.go('menu.Home');
            }
          } else {
            toast($cordovaToast, 'Login Failed', 'long', 'bottom');
          }
        }, function (error) {
          hideLoading($ionicLoading);
          console.log('In Login error', error);
        })
      }
    };

    $scope.socialLogin = function (stype) {
      if (stype === 'FB') {
        showLoading($ionicLoading);
        var fbscopeString = SOCIAL_APP.Facebook.SCOPE;
        var fbscopes = fbscopeString.split(',');
        $cordovaOauth.facebook(SOCIAL_APP.Facebook.APPID, fbscopes, {
          redirect_uri: SOCIAL_APP.Facebook.REDIRECT
        }).then(function (success) {
          console.log(success);
          hideLoading($ionicLoading);
          storeLocal('fbtoken', success.access_token);
          FBME.get(function (response) {
            console.log(response);
            toast($cordovaToast, 'Profile Received Under Working', 'long', 'center');
          }, function (error) {
            console.log(error);
          })
        }, function (error) {
          hideLoading($ionicLoading);
          console.log('social fb', error);
        });
      }

    };
  })
  .controller('RegisterController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $cordovaToast, APIPOST) {
    $scope.registeSubmit = function ($valid, data) {
      if ($valid) {
        showLoading($ionicLoading);
        Register.post(data, function (response) {
          hideLoading($ionicLoading);
          console.log(response);
          if (response.status === true) {
            storeLocal('accesstoken', response.data.access_token);
            storeLocal('appauth', JSON.stringify(response.data));
            toast($cordovaToast, 'Register Success', 'long', 'center');
            $state.go('menu.Home', {}, {
              reload: true
            });
          } else {
            toast($cordovaToast, response.message, 'long', 'center');
          }
        }, function (error) {
          hideLoading($ionicLoading);
          console.log('In RegisterController error', error);
        })
      }
    };
  })
  .controller('ForgotController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $cordovaToast, APIPOST) {
    $scope.forgotSubmit = function ($valid, data) {
      if ($valid) {
        showLoading($ionicLoading);
        data.type = "forgotpassword";
        APIPOST.post(data, function (response) {
          hideLoading($ionicLoading);
          if (response.status === true) {
            ionicDialog($cordovaDialogs, 'Success', 'New password sent your mail.', 'Ok');
            $state.go('menu.Login');
          } else {
            ionicDialog($cordovaDialogs, 'Failed', 'Check entered mail id.', 'Ok');
          }
        }, function (error) {
          hideLoading($ionicLoading);
          console.log('In Forgot error', error);
        })
      }
    };
  })
  .controller('ChangePwdController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $cordovaToast, APIPOST) {
    $scope.pwdSubmit = function ($valid, data) {
      if ($valid) {
        showLoading($ionicLoading);
        Login.post(data, function (response) {
          hideLoading($ionicLoading);
          console.log(response);
        }, function (error) {
          hideLoading($ionicLoading);
          console.log('In ChanPwd error', error);
        })
      }
    };
  })
  .controller('ProfileController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $cordovaToast, APIPOST) {
    $scope.data = [];
    Profile.get(function (response) {
      showLoading($ionicLoading);
      if (response.status === true) {
        hideLoading($ionicLoading);
        $scope.data = response.data;
        $scope.data.telephone = parseInt(response.data.telephone);
      } else {
        hideLoading($ionicLoading);
      }
    }, function (error) {
      hideLoading($ionicLoading);
      console.log('In ProfileController error', error);
    })
    $scope.profileUpdate = function ($valid, data) {
      if ($valid) {
        showLoading($ionicLoading);
        Profile.post(data, function (response) {
          hideLoading($ionicLoading);
          storeLocal('accesstoken', response.data.access_token);
          storeLocal('appauth', JSON.stringify(response.data));
          toast($cordovaToast, 'Profile Updated', 'long', 'center');
          console.log(response);
        }, function (error) {
          hideLoading($ionicLoading);
          console.log('In Login error', error);
        })
      }
    };
  })
  .controller('AccountController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $cordovaToast, APIPOST) {
    $scope.is_edit_enable = false;
    $scope.is_edit = function () {
      $scope.is_edit_enable = true;
    };
    $scope.profileUpdate = function ($valid, data) {
      console.log($valid)
      if ($valid) {
        $scope.is_edit_enable = false;
      }
    };

    $scope.cancel = function () {
      $scope.is_edit_enable = false;
    }
  })
  .controller('ManageAddressController', function ($scope, $rootScope, $state, $ionicLoading, $cordovaDialogs, $cordovaToast, APIPOST) {
    if ($rootScope.is_auth) {
      $scope.auth = getStorage('appauth');
      $scope.addrAdd = false;
      $scope.addrEdit = false;
      $scope.index = function () {
        showLoading($ionicLoading);
        APIPOST.post({
          type: 'getalladdress',
          customer_id: $scope.auth.user_id
        }, function (response) {
          hideLoading($ionicLoading);
          if (response.success === 'true') {
            $scope.address = response.data;
          }
        }, function (error) {
          hideLoading($ionicLoading);
          console.log(error);
        });
      };
      $scope.showDiv = function (showType, id) {
        if (showType === 'add') {
          $scope.addrAdd = true;
          $scope.btnTxt = "Add Address";
        } else if (showType === 'edit') {
          $scope.addrEdit = true;
          $scope.EditId = parseInt(id);
          $scope.btnTxt = "Edit Address";

          showLoading($ionicLoading);
          APIPOST.post({
            type: 'edit_customer_address',
            customer_id: $scope.auth.user_id,
            address_id: $scope.EditId
          }, function (response) {
            hideLoading($ionicLoading);
            if (response.success === 'true') {
              $scope.address = response.data;
            }
          }, function (error) {
            hideLoading($ionicLoading);
            console.log(error);
          });
        } else {
          $scope.addrEdit = false;
          $scope.addrAdd = false;
        }
      };

      $scope.addAddr = function ($valid, data) {
        if ($valid) {
          data.type = 'addcustomeraddress';
          data.customer_id = $scope.auth.user_id;
          if ($scope.addrEdit) {
            data.address_id = $scope.EditId;
          }
          showLoading($ionicLoading);
          APIPOST.post(data, function (response) {
            hideLoading($ionicLoading);
            if (response.success === 'true') {
              toast($cordovaToast, ($scope.addrEdit) ? 'Address updated successfully' : 'Address added successfully', 'long', 'center');
              $scope.addrAdd = false;
              $scope.addrEdit = false;
              $scope.index();
            } else {
              toast($cordovaToast, ($scope.addrEdit) ? 'Address updated failed' : 'Address added failed', 'long', 'center');
            }
          }, function (error) {
            hideLoading($ionicLoading);
            console.log(error);
          });
        }
      };

      $scope.delAddr = function (id) {
        $cordovaDialogs.confirm('Are you sure want to delete?', 'Address', ['Ok', 'Cancel'])
          .then(function (buttonIndex) {
            var btnIndex = buttonIndex;
            if (parseInt(btnIndex) === 1) {
              showLoading($ionicLoading);
              APIPOST.post({
                type: 'deleteaddress',
                address_id: id
              }, function (response) {
                hideLoading($ionicLoading);
                if (response.success === 'true') {
                  toast($cordovaToast, 'Address deleted successfully', 'long', 'center');
                  $scope.index();
                } else {
                  toast($cordovaToast, 'Address deleted failed', 'long', 'center');
                }
              }, function (error) {
                hideLoading($ionicLoading);
              });
            }
          });
      }
      $scope.index();
    } else {
      var sparams = {
        state: 'menu.ManageAddress'
      };
      storeLocal('backurl', JSON.stringify(sparams));
      $state.go('menu.Login');
    }
  })
  .controller('OrdersController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, APIPOST) {
    if ($rootScope.is_auth) {
      $scope.auth = getStorage('appauth'); 
      $scope.index = function () {
        showLoading($ionicLoading);
        APIPOST.post({
          type: 'getallcustomerorders',
          customer_id: $scope.auth.user_id
        }, function (response) {
          hideLoading($ionicLoading);
          if (response.success === 'true') {
            $scope.orders = response.data;
          }
        }, function (error) {
          hideLoading($ionicLoading);
          console.log(error);
        });
      };
      
      $scope.index();
    } else {
      var sparams = {
        state: 'menu.Orders'
      };
      storeLocal('backurl', JSON.stringify(sparams));
      $state.go('menu.Login');
    }
  })
