angular.module('bookmycart')
  .controller('WishlistController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $cordovaToast, $cordovaDialogs, APIPOST) {
    if ($rootScope.is_auth) {
      $scope.index = function(){
        showLoading($ionicLoading);
        $scope.auth = getStorage('appauth');
        APIPOST.post({
          type: 'mywishlist',
          customer_id: $scope.auth.user_id
        }, function (response) {
          hideLoading($ionicLoading);
          if (response.success === 'true') {
              $scope.wishlist = response.data;
          }
        }, function (error) {
          hideLoading($ionicLoading);
        });
      };
      $scope.index();
      $scope.delWish = function(id){
        $cordovaDialogs.confirm('Are you sure want to delete?', 'Wishlist', ['Ok', 'Cancel'])
          .then(function (buttonIndex) {
            var btnIndex = buttonIndex;
            if (parseInt(btnIndex) === 1) {
              showLoading($ionicLoading);
              APIPOST.post({
                type: 'removefromwishlist',
                wishlist_id: id
              }, function (response) {
                hideLoading($ionicLoading);
                if (response.success === 'true') {
                  toast($cordovaToast, 'Deleted successfully', 'long', 'bottom');
                  $scope.index();
                } else {
                  toast($cordovaToast, 'Deleted failed', 'long', 'bottom');
                }
              }, function (error) {
                hideLoading($ionicLoading);
              });
            }
          });
      }
    } else {
      toast($cordovaToast, 'Login and list your wishlist', 'long', 'bottom');
      var sparams = {
        state: 'menu.Wishlist',
      };
      storeLocal('backurl', JSON.stringify(sparams));
      $state.go('menu.Login');
    }
  })
