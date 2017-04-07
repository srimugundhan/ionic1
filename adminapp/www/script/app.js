angular.module('mobix', ['ionic', 'ngResource', 'ngCordova', 'ionic-native-transitions', 'ng-fusioncharts', 'ui.calendar'])
    .run(function($ionicPlatform, $rootScope, $state, $location, IMGURL, UpdateDevice, $cordovaLocalNotification) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
            $rootScope.deviceInformation = ionic.Platform.device();

            /**
             * @ngdoc method
             * @name FCMPlugin.getToken
             * @methodOf module.FCMPlugin
             * @description
             * This method generate the device token for Android. The device token is registered from FCM Server for Using the push notification 
             */
            FCMPlugin.getToken(
                function(token) {
                    console.log(token);
                    if (window.localStorage.getItem('auth') !== null) {
                        var devType = 1;
                        if (angular.lowercase($rootScope.deviceInformation.platform) !== 'android') {
                            devType = 2;
                        }
                        var postParam = {
                            CollegeId: $rootScope.userauth.CollegeId,
                            BranchId: $rootScope.userauth.BranchId,
                            EmpId: $rootScope.userauth.EmpId,
                            devicetoken: token,
                            devicetype: devType
                        }
                        UpdateDevice.post(postParam, function(response) {}, function(error) {});
                    } else {
                        storeLocal('devicetoken', token);
                    }
                },
                function(err) {
                    console.log(err);
                }
            );
            /**
             * @ngdoc method
             * @name FCMPlugin.onNotification
             * @methodOf module.FCMPlugin
             * @description
             * This method is used for show the push notificaiton.
             */

            /* Not yet completed 100% need to be finetune when push is received in APP running stage (Local Push) */
            FCMPlugin.onNotification(
                function(data) {
                    if (data.wasTapped) {
                        $cordovaLocalNotification.schedule({
                            id: 1,
                            title: 'Digital MI',
                            text: data.message,
                            icon: 'res://icon.png'
                        }).then(function(result) {});
                    } else {
                        $cordovaLocalNotification.schedule({
                            id: 1,
                            title: 'Digital MI',
                            text: data.message,
                            icon: 'res://icon.png'
                        }).then(function(result) {});
                    }
                },
                function(msg) {

                },
                function(err) {

                }
            );

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
                if (exceptionUrl.indexOf(url) === -1 && window.localStorage.getItem('auth') === null) {
                    $state.go('Login');
                } else {
                    /* Here for another functions */
                    if (window.localStorage.getItem('auth') !== null) {
                        $rootScope.userauth = JSON.parse(atob(getLocal('auth')));
                        if ($rootScope.userauth.photo !== "") {
                            $rootScope.userauth.imgUrl = IMGURL.profileimg + '/' + $rootScope.userauth.CollegeId + '/' + $rootScope.userauth.BranchId + '/' + $rootScope.userauth.photo;
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
            }).state('mobix.ApplyLeave', {
                url: '/leave/apply',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "up"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/apply_leave.html',
                        controller: 'LeaveApplyController',
                    }
                },
            }).state('mobix.PopMenu', {
                url: '/popmenu',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "up"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/popup_menu.html',
                        controller: 'PopMenuController',
                    }
                },
            }).state('mobix.Students', {
                url: '/students',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "left"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/students_list.html',
                        controller: 'StudentsController',
                    }
                },
            }).state('mobix.Leaves', {
                url: '/leaves',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "right"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/leaves_list.html',
                        controller: 'LeavesController',
                    }
                },
            }).state('mobix.LeaveAvail', {
                url: '/leaves/avail',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "left"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/leaves_avail.html',
                        controller: 'LeavesAvailController',
                    }
                },
            }).state('mobix.SubjectHandle', {
                url: '/subjects/handle',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "right"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/subjects_handle.html',
                        controller: 'SubjectsHandleController',
                    }
                },
            }).state('mobix.LeaveApproval', {
                url: '/leaves/approval',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "right"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/leaves_approval.html',
                        controller: 'LeavesApprovalController',
                    }
                },
            }).state('mobix.LeaveRecommend', {
                url: '/leaves/recommend',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "right"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/leaves_recommend.html',
                        controller: 'LeavesRecommendController',
                    }
                },
            }).state('mobix.StaffApproval', {
                url: '/leaves/staffapproval',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "up"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/staff_approval.html',
                        controller: 'StaffApprovalController',
                    }
                },
            }).state('mobix.TimeTable', {
                url: '/timetable',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "up"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/time_table.html',
                        controller: 'TimeTableController',
                    }
                },
            }).state('mobix.Charts', {
                url: '/charts',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "down"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/charts.html',
                        controller: 'ChartsController',
                    }
                },
            }).state('mobix.Events', {
                url: '/events',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "up"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/events.html',
                        controller: 'EventsController',
                    }
                },
            }).state('mobix.BulkSMS', {
                url: '/sms/send',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "down"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/bulk_sms.html',
                        controller: 'BulkSMSController',
                    }
                },
            }).state('mobix.BulkSMSStaff', {
                url: '/sms/staff',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "down"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/bulk_sms_staff.html',
                        controller: 'BulkSMSStaffController',
                    }
                },
            }).state('mobix.StudLeave', {
                url: '/students/leave',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "down"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/students_leave.html',
                        controller: 'StudentsLeaveController',
                    }
                },
            }).state('mobix.StudAbsStaus', {
                url: '/students/absents',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "down"
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/students_absents.html',
                        controller: 'StudentAbsentCtrl',
                    }
                },
            });
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
    /*$cordovaToast
        .show(message, duration, align)
        .then(function(success) {
            // success
        }, function(error) {
            // error
        });*/
}