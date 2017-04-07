/**
 * ServiceBase - Ionic Framework
 * Angula Version 1.5.3
 * Cordova Version 5.6 >
 * Ionic Version 1.3
 * @category   Js
 * @package    REST
 * @Framework  Ionic, Cordova, Angular
 * @author     Mugundhan Asokan
 * @email      a.mugundhan@gmail.com
 * @copyright  2016 Agriya
 * @license    http://www.agriya.com/ Agriya Licence
 * @link       http://www.agriya.com
 * @since      2016-09-11
 */
angular.module('bookmycart')
  .controller('AppController', function ($scope, $rootScope, $state, $ionicPopup, $cordovaDialogs, $timeout, $location, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $interval, $ionicConfig, APIPOST) {
    $scope.stageGo = function (stateName) {
      if (stateName !== null) {
        $state.go(stateName, {}, {
          reload: true
        });
      } else {
        $state.go('Login', {}, {
          reload: true
        });
      }
    };
    $scope.logout = function () {
      $cordovaDialogs.confirm('Are you sure want to logout?', 'Logout', ['Ok', 'Cancel'])
        .then(function (buttonIndex) {
          var btnIndex = buttonIndex;
          console.log(btnIndex);
          if (parseInt(btnIndex) === 1) {
            window.localStorage.removeItem('appauth');
            $state.go('menu.Home', {}, {
              reload: true
            });
            $timeout(function () {
              $ionicConfig.views.maxCache(0);
              location.reload();
            }, 200);
          }
        });
    };

    $scope.showLeftSlide = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.showRightMenu = function () {
      //$ionicSideMenuDelegate.toggleRight();
      /*Here changed for cart page */
      console.log('here it');
      $state.go('menu.Cart', {}, {
        reload: true
      });
    };

    $scope.cartCount = function () {
      if ($rootScope.is_auth) {
        $scope.auth = getStorage('appauth');
        APIPOST.post({
          type: 'mycart',
          customer_id: $scope.auth.user_id
        }, function (response) {
          if (response.success === 'true') {
            $scope.cart = response.data;
            $rootScope.cartcount = parseInt($scope.cart.items_count);
          }
        });
      } else {
        $rootScope.cartcount = 0;
      }
    };
    $scope.cartCount();
    $scope.$on('cartcountupdate', function (event, data) {
      $scope.cartCount();
    });
  })
  .controller('HomeController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, APIPOST, $timeout) {
    $scope.isShowSearch = false;
    showLoading($ionicLoading);
    APIPOST.post({
      type: 'categories'
    }, function (response) {
      hideLoading($ionicLoading);
      $scope.images = [];
      if (response.success === 'true') {
        $scope.categories = response.data;
      }
    }, function (error) {
      hideLoading($ionicLoading);
      console.log(error);
    });

    $scope.slickConfig = {
      enabled: true,
      autoplay: true,
      draggable: false,
      autoplaySpeed: 3000,
      method: {},
      event: {
        beforeChange: function (event, slick, currentSlide, nextSlide) {},
        afterChange: function (event, slick, currentSlide, nextSlide) {}
      }
    }

    $scope.showSearch = function () {
      $scope.isShowSearch = true;
    };
    $scope.data = {};
    $scope.data.bgColors = [];
    $scope.data.currentPage = 0;

    for (var i = 0; i < 10; i++) {
      $scope.data.bgColors.push("bgColor_" + i);
    }

    var setupSlider = function () {
      //some options to pass to our slider
      $scope.data.sliderOptions = {
        initialSlide: 0,
        direction: 'horizontal', //or vertical
        speed: 300 //0.3s transition
      };

      //create delegate reference to link with slider
      $scope.data.sliderDelegate = null;

      //watch our sliderDelegate reference, and use it when it becomes available
      $scope.$watch('data.sliderDelegate', function (newVal, oldVal) {
        if (newVal != null) {
          $scope.data.sliderDelegate.on('slideChangeEnd', function () {
            $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
            //use $scope.$apply() to refresh any content external to the slider
            $scope.$apply();
          });
        }
      });
    };

    setupSlider();
  }).controller('DashboardController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

  }).controller('WalletController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

  }).controller('AboutController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

  }).controller('ContactController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

  }).controller('FaqController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {
    $scope.groups = [];
    for (var i = 0; i < 10; i++) {
      $scope.groups[i] = {
        name: i,
        items: []
      };
      for (var j = 0; j < 3; j++) {
        $scope.groups[i].items.push(i + '-' + j);
      }
    }

    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function (group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };
    $scope.isGroupShown = function (group) {
      return $scope.shownGroup === group;
    };

  }).controller('RatingController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

  })
  .filter('inSlicesOf', function ($rootScope) {
      /*http://codepen.io/pulkitsinghal/pen/JjmED/*/
    makeSlices = function (items, count) {
      if (!count)
        count = 3;

      if (!angular.isArray(items) && !angular.isString(items)) return items;

      var array = [];
      for (var i = 0; i < items.length; i++) {
        var chunkIndex = parseInt(i / count, 10);
        var isFirst = (i % count === 0);
        if (isFirst)
          array[chunkIndex] = [];
        array[chunkIndex].push(items[i]);
      }

      if (angular.equals($rootScope.arrayinSliceOf, array))
        return $rootScope.arrayinSliceOf;
      else
        $rootScope.arrayinSliceOf = array;

      return array;
    };

    return makeSlices;
  })
