angular.module('mobix', ['ionic', 'ngResource', 'ngCordova', 'ionic-native-transitions', 'ng-fusioncharts', 'ui.calendar'])
    .run(function($ionicPlatform, $rootScope, $state, $location, IMGURL) {
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
            var exceptionUrl = ['Login', 'Forgot'];
            /* For add dynamic class in body tag to manage some default css functions */
            $rootScope.bodyClass = url.replace('.', '_');
            if (url !== undefined) {
                if (exceptionUrl.indexOf(url) === -1 && window.localStorage.getItem('sauth') === null) {
                    $state.go('Login');
                } else {
                    /* Here for another functions */
                    if (window.localStorage.getItem('sauth') !== null) {
                        /*StudentId: $scope.edata.user.studentId,
                              BranchID: $scope.edata.user.branchId,
                              CollegeID: $scope.edata.user.collegeId
                              */
                        $rootScope.userauth = JSON.parse(atob(getLocal('sauth')));
                        $rootScope.userauth.userdetails = JSON.parse(getLocal('userdetails'));
                        if ($rootScope.userauth.photo !== "") {
                            $rootScope.userauth.imgUrl = IMGURL.profileimg + '/' + $rootScope.userauth.collegeId + '/' + $rootScope.userauth.branchId + '/' + $rootScope.userauth.userdetails.photo;
                        } else {
                            $rootScope.userauth.imgUrl = "images/profile.jpg";
                        }
                    }

                    if (url === 'mobix.Dashboard') {
                        $rootScope.isDashboard = true;
                    } else {
                        $rootScope.isDashboard = false;
                    }
                }
            }
        });
    })
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
        /*var getToken = {
            'TokenServiceData': function(TokenService) {
                return TokenService.promise;
            }
        };*/
        $stateProvider
            .state('Login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginController',
            }).state('mobix', {
                url: '/mobix',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppController'
            }).state('mobix.Dashboard', {
                url: '/dashboard',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "down"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dashboard.html',
                        controller: 'DashboardController',
                    }
                },
            }).state('mobix.Profile', {
                url: '/profile',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "up"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileController',
                    }
                },
            }).state('mobix.BookTrans', {
                url: '/books/transactions',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "up"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/books_trans.html',
                        controller: 'BookTranController',
                    }
                },
            }).state('mobix.BookSearch', {
                url: '/books/search',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "left"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/books_search.html',
                        controller: 'BookSearchController',
                    }
                },
            }).state('mobix.Wallet', {
                url: '/wallet',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "left"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/wallet.html',
                        controller: 'WalletController',
                    }
                },
            })
            /*.state('mobix.WalletPay', {
                            url: '/wallet/pay/:name',
                            nativeTransitions: {
                                "type": "flip",
                                "direction": "left"
                            },
                            views: {
                                'menuContent': {
                                    templateUrl: 'templates/wallet_pay.html',
                                    controller: 'WalletController',
                                }
                            },
                        })*/
        ;

        $urlRouterProvider.otherwise(function($injector, $location) {
            var $state = $injector.get("$state");
            $state.go("Login", {}, {
                reload: true
            });
        });
    })
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('HeaderInjector');
    })
    /*For using the animation purpose*/
    .config(function($ionicNativeTransitionsProvider) {
        $ionicNativeTransitionsProvider.setDefaultOptions({
            duration: 400, // in milliseconds (ms), default 400,
            slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
            iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
            androiddelay: -1, // same as above but for Android, default -1
            winphonedelay: -1, // same as above but for Windows Phone, default -1,
            fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
            fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
            triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
            backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
        });
    })
    .factory('HeaderInjector', function() {
        return {
            request: function(config) {
                config.headers['content-type'] = 'application/x-www-form-urlencoded';
                return config;
            }
        };

    })
    .filter('dateFmt', function($filter) {
        return function(input) {
            if (input == null) { return ""; }
            var _date = $filter('date')(new Date(input), 'dd-MMM-yyyy');
            return _date.toUpperCase();
        };
    })
    /*.config(function(ChartJsProvider) {
        ChartJsProvider.setOptions({ colors: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
    });*/

/**
 * @ngdoc function
 * @name getStorgae
 * @methodOf global getStorgae
 * @param {string} name
 * @description
 * This funciton is used to get the localstorage value.
 * @returns {JSON} JSON data
 */
function getStorgae(keyname) {
    return JSON.parse(window.localStorage.getItem(keyname));
}

/**
 * @ngdoc function
 * @name getStorgae
 * @methodOf global getStorgae
 * @description
 * @param {string, string} name, data
 * This funciton is used to store the localstorage.
 */
function storeLocal(name, data) {
    window.localStorage.setItem(name, data);
}

/**
 * @ngdoc function
 * @name getStorgae
 * @methodOf global getStorgae
 * @description
 * @param {string} name
 * This funciton is used to get the localstorage.
 * @returns {string} local stored string
 */
function getLocal(name) {
    return window.localStorage.getItem(name);
}

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

function toast($cordovaToast, message, duration, align) {
    //$cordovaToast.show(message, duration, align).then(function() {});
    $cordovaToast
        .show(message, duration, align)
        .then(function(success) {
            // success
        }, function(error) {
            // error
        });
}