/**
 * ServiceBase - Ionic Framework
 * Angula Version 1.5.8
 * Cordova Version 5.6 >
 * Ionic Version 1.3
 * @category   Js
 * @package    REST
 * @Framework  Ionic, Cordova, Angular
 * @author     Shrikant H Talawar
 * @email      admin@shlrtechnosoft.in
 * @since      2017-01-01
 */
angular.module('mobix')
    .controller('AppController', function($scope, $rootScope, $state, $ionicPopup, $location, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $window, $timeout, $ionicConfig) {
        if (window.localStorage.getItem('auth') !== null) {
            $scope.isAuth = true;
            $rootScope.user = JSON.parse(atob(getLocal('auth')));
        }
        $scope.linkGo = function(link) {
            window.open(link, '_system');
        };
        $scope.stageGo = function(stateName) {
            if (stateName !== null) {
                if ($state.current.name !== stateName) {
                    $state.go(stateName, {}, {
                        reload: true
                    });
                }
            } else {
                $state.go('Login', {}, {
                    reload: true
                });
            }
        };
        $scope.logout = function() {
            window.localStorage.removeItem('auth');
            $state.go('Login', {}, {
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
            $ionicSideMenuDelegate.toggleRight();
        };
    })

.controller('DashboardController', function($scope, $state, $rootScope, $ionicPopup, $location, $ionicSideMenuDelegate) {
    $scope.userDetails = $rootScope.user;


}).controller('PopMenuController', function($scope, $state, $rootScope, $ionicPopup, $location, $ionicSideMenuDelegate) {
    $scope.userDetails = $rootScope.user;

    $scope.linkGo = function(link) {
        window.open(link, '_system');
    };
});