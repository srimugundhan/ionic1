angular.module('bookmycart')
  .controller('CartController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $cordovaToast, $cordovaDialogs, APIPOST) {
    if ($rootScope.is_auth) {
      $scope.auth = getStorage('appauth');
      $scope.index = function(){
        showLoading($ionicLoading);
        APIPOST.post({
          type: 'mycart',
          customer_id: $scope.auth.user_id
        }, function (response) {
          hideLoading($ionicLoading);
          if (response.success === 'true') {
            $scope.cart = response.data;
            $rootScope.cartcount = parseInt($scope.cart.items_count); 
          }
        }, function (error) {
          hideLoading($ionicLoading);
          console.log(error);
        });
        $scope.quantity = [];
        for(var i=1; parseInt(i)<=10; i++){
          $scope.quantity.push(parseInt(i));
        }
      };
      $scope.quantityChange = function(prodid, cartid, quant){
        showLoading($ionicLoading);
        APIPOST.post({
          type: 'editcart',
          customer_id: $scope.auth.user_id,
          cart_id:cartid,
          quantity:quant
        }, function (response) {
          hideLoading($ionicLoading);
          if (response.success === 'true') {
            toast($cordovaToast, 'Product quantity updated', 'long', 'bottom');
            $scope.index();
          }
        }, function (error) {
          hideLoading($ionicLoading);
          console.log(error);
        });
      };
      $scope.deleteCart = function(prodid, cartid){
        $cordovaDialogs.confirm('Are you sure want to delete?', 'Cart', ['Ok', 'Cancel'])
          .then(function(buttonIndex) {
              var btnIndex = buttonIndex; 
              if (parseInt(btnIndex) === 1) {
                showLoading($ionicLoading);
                APIPOST.post({
                  type: 'removefromcart',
                  cart_id: cartid,
                  customer_id: $scope.auth.user_id
                }, function (response) {
                  hideLoading($ionicLoading);
                  if (response.success === 'true') {
                    toast($cordovaToast, 'Product Removed', 'long', 'bottom');
                    $scope.index();
                  }
                }, function (error) {
                  hideLoading($ionicLoading); 
                });
              }
          });
      };
      $scope.index();
    } else {
        var sparams = {
            state: 'menu.Cart'
        };
        storeLocal('backurl', JSON.stringify(sparams));
        $state.go('menu.Login');
    }
  })
