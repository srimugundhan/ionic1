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
    .controller('AppController', function($scope, $rootScope, $state, $ionicPopup, $timeout, $location, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $interval) {
        $scope.stageGo = function(stateName) {
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
        $scope.logout = function() {
            window.localStorage.removeItem('bookmycartauth');
            $state.go('menu.Home', {}, {
                reload: true
            });
            $timeout(function() {
                $ionicConfig.views.maxCache(0);
                location.reload();
            }, 200);

        };

        $scope.showLeftSlide = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.showRightMenu = function() {
            //$ionicSideMenuDelegate.toggleRight();
            /*Here changed for cart page */
            console.log('here it');
            $state.go('menu.Cart', {}, {
                reload: true
            });
        };

    }).controller('HomeController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

    }).controller('DashboardController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

    }).controller('CartController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

    }).controller('OrdersController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

    }).controller('WishlistController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

    }).controller('AccountController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

    }).controller('CategoriesController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup, Categories) {
        showLoading($ionicLoading);
        Categories.get(function(response) {
            hideLoading($ionicLoading);
            if (response.status === true) {
                $scope.categories = response.data;
            } else {
                $scope.categories = [];
            }
        }, function(error) {
            hideLoading($ionicLoading);
            console.log('error category get', error);
        });
    }).controller('SubCategoriesController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup, SubCategories) {
        showLoading($ionicLoading);
        SubCategories.get({ id: $state.params.id }, function(response) {
            hideLoading($ionicLoading);
            if (response.status === true) {
                $scope.categories = response.data;
            } else {
                $scope.categories = [];
            }
        }, function(error) {
            hideLoading($ionicLoading);
            console.log('error category get', error);
        });
    }).controller('FeatureProdController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

    }).controller('LatestProdController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

    }).controller('BestSellerController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

    }).controller('SpecialOfferController', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup) {

    })