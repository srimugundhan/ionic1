// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('bookmycart', ['ionic', 'ngResource', 'ngCordova', 'http-auth-interceptor', 'ngCordovaOauth'])
    .run(function($ionicPlatform, $rootScope, $state, $location, $ionicPopup) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        /* For  check the exception url to prevent the auth */
        $rootScope.$state = $state;
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            var url = toState.name;
            $rootScope.curentState = url;
            var exceptionUrl = ['menu.Login', 'menu.Forgot', 'menu.Register', 'menu.Home'];
            /* For add dynamic class in body tag to manage some default css functions */
            $rootScope.bodyClass = url.replace('.', '_');
            if (url !== undefined) {
                if (exceptionUrl.indexOf(url) === -1 && window.localStorage.getItem('appauth') === null) {
                    $state.go('menu.Home');
                } else {
                    $rootScope.is_auth = false;
                    /*Here function to handle when the state change*/
                    if (window.localStorage.getItem('appauth') !== null) {
                        $rootScope.is_auth = true;
                    }
                }
                if (window.localStorage.getItem('appauth') !== null) {
                    $rootScope.useravatar = "img/profile.png";
                    $rootScope.username = "User";
                } else {
                    $rootScope.useravatar = "img/profile.png";
                    $rootScope.username = "Guest";
                }
            }
        });
    }).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
        /*var getToken = {
            'TokenServiceData': function(TokenService) {
                return TokenService.promise;
            }
        };*/
        $stateProvider
            .state('menu', {
                url: '/menu',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppController'
            }).state('menu.Home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeController',
                    }
                },
            }).state('menu.Login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginController',
                    }
                },
            }).state('menu.Forgot', {
                url: '/forgot_password',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/forgot_password.html',
                        controller: 'ForgotController'
                    }
                },
            }).state('menu.Register', {
                url: '/register',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/register.html',
                        controller: 'RegisterController',
                    }
                },
            }).state('menu.Account', {
                url: '/users/account',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account.html',
                        controller: 'AccountController',
                    }
                },
            }).state('menu.Wishlist', {
                url: '/wishlist',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/wishlist.html',
                        controller: 'WishlistController',
                    }
                },
            }).state('menu.Orders', {
                url: '/orders',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/orders.html',
                        controller: 'OrdersController',
                    }
                },
            }).state('menu.Profile', {
                url: '/users/profile',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileController',
                    }
                },
            }).state('menu.Cart', {
                url: '/cart',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/cart.html',
                        controller: 'CartController',
                    }
                },
            }).state('menu.RateApp', {
                url: '/apprate',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/apprating.html',
                        controller: 'RatingController',
                    }
                },
            }).state('menu.Wallet', {
                url: '/wallet',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/wallet.html',
                        controller: 'WalletController',
                    }
                },
            }).state('menu.FAQ', {
                url: '/faq',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/faq.html',
                        controller: 'FaqController',
                    }
                },
            }).state('menu.Contact', {
                url: '/contact',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/contact.html',
                        controller: 'ContactController',
                    }
                },
            }).state('menu.About', {
                url: '/about',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/about.html',
                        controller: 'AboutController',
                    }
                },
            }).state('menu.ProductView', {
                url: '/products/view/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/product_view.html',
                        controller: 'ProductViewController',
                    }
                },
            }).state('menu.CategoryListing', {
                url: 'categories/products/list/:id/:category',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/category_product_list.html',
                        controller: 'CategoryProductListController',
                    }
                },
            }).state('menu.ManageAddress', {
                url: 'users/address',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/manage_address.html',
                        controller: 'ManageAddressController',
                    }
                },
            });

        $urlRouterProvider.otherwise(function($injector, $location) {
            var $state = $injector.get("$state");
            if (window.localStorage.getItem('appauth') !== null) {
                $state.go("menu.Home", {}, {
                    reload: true
                });
            } else {
                $state.go("menu.Login", {}, {
                    reload: true
                });
            }
        });
    })
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('HeaderInjector');
    })
    .factory('HeaderInjector', function() {
        return {
            request: function(config) {
                config.headers['content-type'] = 'text/html; charset=UTF-8';
                return config;
            }
        };

    })


/**
 * @ngdoc function
 * @name showLoading
 * @methodOf global showLoading
 * @param {string} $ionicLoading
 * @description
 * This funciton is used all the page for show the loading. If client need to be change the loading mean just change this one place.
 */
function showLoading($ionicLoading) {
    $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
    });
}

/**
 * @ngdoc function
 * @name hideLoading
 * @methodOf global showLoading
 * @param {string} $ionicLoading
 * @description
 * This funciton is used all the page for show the loading.
 */
function hideLoading($ionicLoading) {
    $ionicLoading.hide();
}

/**
 * @ngdoc function
 * @name ionicAlert
 * @methodOf global ionicAlert
 * @param {string, string, string} $ioincPopup, title, message
 * @description
 * This funciton is used all the page for show the popup alert message. If need to change the UI means simply change this one place it will affect all those place where we are used....
 */
function ionicAlert($ionicPopup, popuptitle, message) {
    if (popuptitle === 'Failed!') {
        var iconTitle = '<i class="ion ion-alert-circled assertive"> </i> ' + popuptitle;
    } else if (popuptitle === 'Success!') {
        var iconTitle = '<i class="ion ion-checkmark-circled positive"> </i> ' + popuptitle;
    } else {
        var iconTitle = popuptitle;
    }
    $ionicPopup.alert({
        title: iconTitle,
        template: message
    });
}

function ionicDialog($cordovaDialogs, popuptitle, message, btnName) {

    if (popuptitle === 'Failed!') {
        var iconTitle = '<i class="ion ion-alert-circled assertive"> </i> ' + popuptitle;
    } else if (popuptitle === 'Success!') {
        var iconTitle = '<i class="ion ion-checkmark-circled positive"> </i> ' + popuptitle;
    } else {
        var iconTitle = popuptitle;
    }
    $cordovaDialogs.alert(message, iconTitle, btnName).then(function() {});
}

/**
 * @ngdoc function
 * @name getStorage
 * @methodOf global getStorage
 * @param {string} name
 * @description
 * This funciton is used to get the localstorage value.
 * @returns {JSON} JSON data
 */
function getStorage(keyname) {
    return JSON.parse(window.localStorage.getItem(keyname));
}

/**
 * @ngdoc function
 * @name getStorage
 * @methodOf global getStorage
 * @description
 * @param {string, string} name, data
 * This funciton is used to store the localstorage.
 */
function storeLocal(name, data) {
    window.localStorage.setItem(name, data);
}

/**
 * @ngdoc function
 * @name getStorage
 * @methodOf global getStorage
 * @description
 * @param {string} name
 * This funciton is used to get the localstorage.
 * @returns {string} local stored string
 */
function getLocal(name) {
    return window.localStorage.getItem(name);
}

function toast($cordovaToast, message, duration, align) {
    //$cordovaToast.show(message, duration, align).then(function() {});
    $cordovaToast.show(message, duration, align).then(function(success) {}, function(error) {});
}