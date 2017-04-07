angular.module('bookmycart')
  .controller('CategoriesController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, Categories) {
    showLoading($ionicLoading);
    Categories.get(function (response) {
      hideLoading($ionicLoading);
      if (response.status === true) {
        $scope.categories = response.data;
      } else {
        $scope.categories = [];
      }
    }, function (error) {
      hideLoading($ionicLoading);
      console.log('error category get', error);
    });
  })
  .controller('CategoryProductListController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, APIPOST) {
    showLoading($ionicLoading);
    $scope.category = $state.params.category;
    APIPOST.post({
      type: 'productsList',
      category_id: $state.params.id
    }, function (response) {
      hideLoading($ionicLoading);
      if (response.success === 'true') {
        $scope.products = response.data;
      }
    }, function (error) {
      hideLoading($ionicLoading);
      console.log(error);
    });
  })
  .controller('ProductViewController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $window, APIPOST, $cordovaDialogs, $cordovaToast) {
    $scope.isFavorite = false;
    showLoading($ionicLoading);
    APIPOST.post({
      type: 'productdetail',
      product_id: $state.params.id
    }, function (response) {
      hideLoading($ionicLoading);
      if (response.success === 'true') {
          $scope.product = response.data[0];
        if ($rootScope.is_auth) {
          showLoading($ionicLoading);
          $scope.auth = getStorage('appauth');
          APIPOST.post({
            type: 'mywishlist',
            customer_id: $scope.auth.user_id
          }, function (response) {
            hideLoading($ionicLoading);
            if (response.success === 'true') {
              angular.forEach(response.data, function (value) {
                if (parseInt(value.product_id) === parseInt($state.params.id)) {
                  $scope.isFavorite = true;
                  $scope.wishlist_id = value.wishlist_id;
                }
              });
            }
          }, function (error) {
            hideLoading($ionicLoading);
          });
        }
      }
    }, function (error) {
      hideLoading($ionicLoading);
      console.log(error);
    });


    $scope.favorpost = function (postparams) {
           showLoading($ionicLoading);
          APIPOST.post(postparams, function (response) {
            hideLoading($ionicLoading);
            if (response.success === 'true') { 
              if (!$scope.isFavorite) {
                toast($cordovaToast, 'Added in Wishlist', 'long', 'bottom');
              } else {
                toast($cordovaToast, 'Wishlist added failed', 'long', 'bottom');
              }
              if (postparams.type === 'removefromwishlist') {
                $scope.isFavorite = false;
              } else {
                $scope.isFavorite = true;
                // $scope.wishlist_id = response.data.wishlist_id;
              }
            } else {
              if (!$scope.isFavorite) {
                toast($cordovaToast, 'Wishlist added failed', 'long', 'bottom');
              } else {
                toast($cordovaToast, 'Wishlist removed failed', 'long', 'bottom');
              }
            }
          }, function (error) {
            hideLoading($ionicLoading);
          });
        };


    $scope.favorite = function () {
      if ($rootScope.is_auth) {
        $scope.auth = getStorage('appauth');
        if (!$scope.isFavorite) {
          var favorparam = {
            type: 'addtowishlist',
            product_id: $state.params.id,
            customer_id: $scope.auth.user_id
          };
          $scope.favorpost(favorparam);
        } else {
          $cordovaDialogs.confirm('Are you sure remove in Wishlist?', 'Confirm', ['Ok', 'Cancel'])
            .then(function (buttonIndex) {
              var btnIndex = buttonIndex;
              var unfavorparam = {
                type: 'removefromwishlist',
                wishlist_id: $scope.wishlist_id
              };
              if (parseInt(btnIndex) === 1) {
                $scope.favorpost(unfavorparam);
              }
            });
        }
      } else {
        toast($cordovaToast, 'Login and wishlist the product', 'long', 'bottom');
        var sparams = {
          state: 'menu.ProductView',
          params: {
            id: $state.params.id
          }
        };
        storeLocal('backurl', JSON.stringify(sparams));
        $state.go('menu.Login');
      }
    };

    $scope.addCart = function () {
      if ($rootScope.is_auth) {
        $scope.auth = getStorage('appauth');
        var cartparam = {
          type: 'add_to_cart',
          product_id: $state.params.id,
          customer_id: $scope.auth.user_id,
          quantity: 1
        };
         showLoading($ionicLoading);
        APIPOST.post(cartparam, function (response) {
          hideLoading($ionicLoading);
          if (response.success === 'true') {
            toast($cordovaToast, 'Added cart successfully', 'long', 'bottom');
            $scope.$emit('cartcountupdate', true);
          } else {
            toast($cordovaToast, 'Cart added failed', 'long', 'bottom');
          }
        }, function (error) {
          hideLoading($ionicLoading);
          console.log(error);
        });
      } else {
        toast($cordovaToast, 'Login and add the product in cart', 'long', 'bottom');
        var sparams = {
          state: 'menu.ProductView',
          params: {
            id: $state.params.id
          }
        };
        storeLocal('backurl', JSON.stringify(sparams));
        $state.go('menu.Login');
      }
    };

    $scope.buyNow = function () {
      if ($rootScope.is_auth) {

      } else {
        toast($cordovaToast, 'Login and add the product in cart', 'long', 'bottom');
        var sparams = {
          state: 'menu.ProductView',
          params: {
            id: $state.params.id
          }
        };
        storeLocal('backurl', JSON.stringify(sparams));
        $state.go('menu.Login');
      }
    };
  })
