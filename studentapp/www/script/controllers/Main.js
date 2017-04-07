/**
 * ServiceBase - Ionic Framework
 * Angula Version 1.5.8
 * Cordova Version 5.6 >
 * Ionic Version 1.3
 * @category   Js
 * @package    REST
 * @Framework  Ionic, Cordova, Angular
 * @author     Mugundhan Asokan
 * @email      mugundhan.vlr@gmail.com
 * @since      2017-06-16
 */
angular.module('mobix')
    .controller('AppController', function($scope, $rootScope, $state, $ionicPopup, $location, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $window, $timeout, $ionicConfig) {
        if (window.localStorage.getItem('sauth') !== null) {
            $scope.isAuth = true;
            $rootScope.user = JSON.parse(atob(getLocal('sauth')));
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
            window.localStorage.removeItem('sauth');
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