"use strict";
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
    $cordovaToast
        .show(message, duration, align)
        .then(function(success) {
            // success
        }, function(error) {
            // error
        });
}
"use strict";
/**
 * @ngdoc constant
 * @name mobix.constant
 * @description
 * APP Constant
 */
angular.module('mobix')
    .constant('URLCONFIG', {
        api_url: 'http://125.99.253.22/services/attendanceservice.asmx/'
    })
    .constant('USERAVATAR', {
        image64: 'http://placehold.it/64x64',
        image300: 'http://placehold.it/300x300'
    })
    .constant('NOIMG', {
        image500: 'http://placehold.it/500x450'
    })
    .constant('IMGURL', {
        /* profileimg: "http://digitalmis.in/Upload/EmpPhotos/",
         collogo: "http://digitalmis.in/Upload/EmpPhotos/"*/
        profileimg: "http://125.99.253.22/Upload/EmpPhotos/",
        collogo: "http://125.99.253.22/Upload/EmpPhotos/"
    })
"use strict";
angular.module('mobix')
    .factory('Login', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'Login', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('LeaveGroup', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetEmpLeaveGroup', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('Incharges', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getInchargeStaffNames', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('LeaveTypes', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getleavenames', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('LeaveAvail', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getInitialLeaves', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('ApplyLeave', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'SaveLeaveApply', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetStudents', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetStudents', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetLeaveStatusMaster', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetLeaveStatusMaster', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('Getappliedleave', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'Getappliedleave', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetSubjects', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetSubjects', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetClassHandlings', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetClassHandlings', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetLeavedetails', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetLeavedetails', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetCourses', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetCourses', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('SaveLeaveApproval', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'SaveLeaveApproval', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('leaveApproval', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'leaveApproval', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('leaveapprovalrejection', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'leaveapprovalrejection', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('leaverecommendation', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'leaverecommendation', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('SaveLeaveRecommend', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'SaveLeaveRecommend', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('leaverecommendrejection', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'leaverecommendrejection', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('staffinchargeleaveapproval', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'staffinchargeleaveapproval', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('savestaffICleave', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'savestaffICleave', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('savestaffICleaverejection', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'savestaffICleaverejection', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('getTimeTable', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getTimeTable', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('getstudentcountcoursewise', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getstudentcountcoursewise', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetEvents', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetEvents', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetCoursesAdmin', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetCoursesAdmin', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('UpdateDevice', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'pushnotifyupdate', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('GetSemister', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetSemister', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('GetMessageTemplate', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetMessageTemplate', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('GetSMSTemplate', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetSMSTemplate', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('sendBulkSMSNew', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'sendBulkSMSNew', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('getStudentsAll', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getStudentsAll', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('getEmpData', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getEmpData', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('GetDepartments', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetDepartments', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('getJobTitle', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getJobTitle', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('getStudentWSec', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getStudentWSec', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('Getsections', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'Getsections', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('SaveStuAttendanceApp', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'SaveStuAttendanceApp', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('GetEmpCourseSubjects', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetEmpCourseSubjects', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('getstudentattstatus', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getstudentattstatus', {}, {
            post: {
                method: 'POST'
            }
        });
    })
        
"use strict";
angular.module('mobix')
    .controller('ChartsController', function($scope, $rootScope, $state, $ionicLoading, $cordovaToast, getstudentcountcoursewise, $timeout) {
        /*$scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        $scope.series = ['Series A', 'Series B'];

        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];*/
        $scope.myDataSource = {
            chart: {
                caption: "Students Count ",
                subcaption: "",
                startingangle: "120",
                showlabels: "0",
                showlegend: "1",
                enablemultislicing: "0",
                slicingdistance: "15",
                showpercentvalues: "0",
                showpercentintooltip: "0",
                plottooltext: "Student Count in $label  : $datavalue",
                theme: "fint"
            }
        };
        $scope.myDataSource.data = [];
        var postData = {
            CollegeId: $rootScope.userauth.CollegeId,
            BranchId: $rootScope.userauth.BranchId
        }
        showLoading($ionicLoading);
        getstudentcountcoursewise.post(postData, function(response) {
            hideLoading($ionicLoading);
            var responseData = response.d;
            responseData = JSON.parse(responseData.replace('},]', '}]'));
            $scope.studentsCount = responseData.studentcount;
            angular.forEach($scope.studentsCount, function(val) {
                $scope.myDataSource.data.push({ label: val.coursedes, value: val.stucount });
            });
        }, function(error) {
            hideLoading($ionicLoading);
            console.log('Chart Error', error);
        });

        $timeout(function() {
            //$('.raphael-group-8-creditgroup').attr('style', 'display:none');
            var cname = angular.element(document.getElementsByClassName(".raphael-group-8-creditgroup"));
            cname.html = "";
            console.log(cname);
        }, 500);

        /*
                $scope.pieLabel = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
                $scope.pieData = [300, 500, 100, 40, 120];*/
    })
"use strict";
angular.module('mobix')
  .controller('LeaveApplyController', function ($scope, $rootScope, $state, $ionicLoading, $cordovaToast, LeaveGroup, Incharges, LeaveTypes, LeaveAvail, ApplyLeave, $cordovaDatePicker, $timeout, $filter, $cordovaDialogs) {
    if (window.localStorage.getItem('auth') !== null) {
      $scope.userauth = $rootScope.userauth;
      $scope.data = {};
      $scope.staffInCg = {};
      $scope.is_exit_leave = false;
      $scope.data.EmpId = $rootScope.userauth.EmpId;
      //console.log($scope.userauth);
      $scope.index = function () {
        var commondata = {
          CollegeId: $rootScope.userauth.CollegeId,
          BranchId: $rootScope.userauth.BranchId,
          EmpId: $rootScope.userauth.EmpId
        };
        showLoading($ionicLoading);
        LeaveGroup.post(commondata, function (response) {
          hideLoading($ionicLoading);
          var responseData = response.d;
          responseData = JSON.parse(responseData.replace('},]', '}]'));
          $scope.leaveGroups = responseData.leavegroup;
          $scope.data.group_name = responseData.leavegroup[0]['code'];
          $scope.data.EmpName = responseData.leavegroup[0]['empname'];

          showLoading($ionicLoading);
          var leavePostData = {
            CollegeId: $rootScope.userauth.CollegeId,
            BranchId: $rootScope.userauth.BranchId,
            group_name: $scope.data.group_name
          };
          LeaveTypes.post(leavePostData, function (response) {
            hideLoading($ionicLoading);
            var responseData = response.d;
            responseData = JSON.parse(responseData.replace('},]', '}]'));
            $scope.leaveTypes = responseData.leavename;
          }, function (error) {
            hideLoading($ionicLoading);
          });
        }, function (error) {
          hideLoading($ionicLoading);
        });
        showLoading($ionicLoading);
        Incharges.post(commondata, function (response) {
          hideLoading($ionicLoading);
          var responseData = response.d;
          responseData = JSON.parse(responseData.replace('},]', '}]'));
          $scope.inchargs = responseData.inchargestaff;
        }, function (error) {
          hideLoading($ionicLoading);
        });


      };
      $scope.index();

      $scope.leaveCheck = function (leavetype) {
        if (leavetype !== undefined) {
          var leaveavailPostData = {
            CollegeId: $rootScope.userauth.CollegeId,
            BranchId: $rootScope.userauth.BranchId,
            leavename: leavetype,
            empid: $rootScope.userauth.EmpId,
            group_name: $scope.data.group_name
          };
          showLoading($ionicLoading);
          LeaveAvail.post(leaveavailPostData, function (response) {
            hideLoading($ionicLoading);
            var responseData = response.d;
            responseData = JSON.parse(responseData.replace('},]', '}'));
            console.log(responseData);
            $scope.data.leaveAvail = responseData.leavecount.code;
          }, function (error) {
            hideLoading($ionicLoading);
          })
        }
      };
      $scope.is_half_day = function (val) {
        if (val === true) {
          $scope.data.NoofDays = 0.5;
        } else {
          $scope.data.NoofDays = 1;
        }
      };
      $scope.applyLeave = function ($valid, data) {
        $cordovaDialogs.confirm('Are you sure you want to Apply Leave ?', 'Confirm', ['Ok', 'Cancel']).then(function (buttonIndex) {
          var btnIndex = buttonIndex;
          if (parseInt(btnIndex) === 1) {
            showLoading($ionicLoading);
            if (data.leaveAvail !== undefined) {
              if (parseInt(data.NoofDays) > parseInt(data.leaveAvail)) {
                $scope.is_exit_leave = true;
              } else {
                $scope.is_exit_leave = false;
              }
            }
            if ($valid && !$scope.is_exit_leave) {
              staffParseData = JSON.parse(data.StaffICEmpID);
              var leaveApplyPostData = {
                CollegeId: $rootScope.userauth.CollegeId,
                BranchId: $rootScope.userauth.BranchId,
                EmpId: data.EmpId,
                group_name: data.group_name,
                NoofDays: data.NoofDays,
                leavename: data.LeaveType,
                StaffICEmpID: staffParseData.EmpID,
                StaffICName: staffParseData.Name,
                fromdate: $filter('date')(new Date(data.fromdate), 'MM/dd/yyyy'),
                todate: $filter('date')(new Date(data.todate), 'MM/dd/yyyy'),
                EmpName: data.EmpName,
                LeaveType: data.LeaveType,
              }

              ApplyLeave.post(leaveApplyPostData, function (response) {
                hideLoading($ionicLoading);
                console.log(response);
                if (response.d !== 'Fail') {
                  toast($cordovaToast, 'Leave applied successfully', 'long', 'center');
                  $timeout(function () {
                    $state.go('mobix.Dashboard');
                  }, 1000);
                } else {
                  toast($cordovaToast, 'Leave applied failed', 'long', 'center');
                }
              }, function (error) {
                hideLoading($ionicLoading);
                toast($cordovaToast, 'Leave applied failed', 'long', 'center');
              })
            }
          }
        });
      };

      function showCalendar(val) {
        var options = {
          date: new Date(),
          mode: 'date',
          //minDate: new Date() - 10000,
          allowOldDates: false,
          allowFutureDates: true,
          doneButtonLabel: 'DONE',
          doneButtonColor: '#F2F3F4',
          cancelButtonLabel: 'CANCEL',
          cancelButtonColor: '#000000'
        };
        if (val === 2) {
          options.minDate = new Date() + 1;
        }

        $cordovaDatePicker.show(options).then(function (date) {
          alert(date);
        });
      }
    } else {
      /*Here need to redirect the dashboard page*/
      $state.go('Login');
    }
  })
  .controller('LeavesController', function ($scope, $rootScope, $state, $ionicLoading, $cordovaToast, Getappliedleave, GetLeaveStatusMaster) {
    if (window.localStorage.getItem('auth') !== null) {
      $scope.leaveDetails = [];
      GetLeaveStatusMaster.post({
        CollegeId: $rootScope.userauth.CollegeId
      }, function (response) {
        hideLoading($ionicLoading);
        var responseData = response.d;
        responseData = JSON.parse(responseData.replace('},]', '}]'));
        $scope.leaveStatus = responseData.leavestatus;
      }, function (error) {
        hideLoading($ionicLoading);
        console.log(error);
      });

      $scope.selectStatus = function (status) {
        showLoading($ionicLoading);
        var postdata = {
          CollegeId: $rootScope.userauth.CollegeId,
          EmpId: $rootScope.userauth.EmpId,
          sts: status
        }
        Getappliedleave.post(postdata, function (response) {
          hideLoading($ionicLoading);
          var responseData = response.d;
          responseData = JSON.parse(responseData.replace('},]', '}]'));
          if (responseData.leaveapplieddetails !== 'nodata') {
            $scope.leaveDetails = responseData.leaveapplieddetails;
            console.log($scope.leaveDetails);
          } else {
            $scope.leaveDetails = [];
          }
        }, function (error) {
          hideLoading($ionicLoading);
          console.log(error);
        });
      };
    } else {
      $state.go('Login');
    }
  })
  .controller('LeavesAvailController', function ($scope, $rootScope, $state, $ionicLoading, $cordovaToast, GetLeavedetails) {
    if (window.localStorage.getItem('auth') !== null) {
      $scope.leaveDetails = [];
      showLoading($ionicLoading);
      var postdata = {
        CollegeId: $rootScope.userauth.CollegeId,
        EmpId: $rootScope.userauth.EmpId,
      };
      GetLeavedetails.post(postdata, function (response) {
        hideLoading($ionicLoading);
        var responseData = response.d;
        responseData = JSON.parse(responseData.replace('},]', '}]'));
        if (responseData.leaveavailable !== 'nodata') {
          $scope.leaveDetails = responseData.leaveavailable;
        } else {
          $scope.leaveDetails = [];
        }
      }, function (error) {
        hideLoading($ionicLoading);
        console.log(error);
      });
    } else {
      $state.go('Login');
    }
  })
  .controller('LeavesApprovalController', function ($scope, $rootScope, $state, $filter, $ionicLoading, $cordovaToast, $cordovaDialogs, leaveApproval, SaveLeaveApproval, leaveapprovalrejection) {
    if (window.localStorage.getItem('auth') !== null) {
      $scope.leaveDetails = [];
      showLoading($ionicLoading);
      var postdata = {
        CollegeId: $rootScope.userauth.CollegeId,
        EmpId: $rootScope.userauth.EmpId,
      };
      leaveApproval.post(postdata, function (response) {
        hideLoading($ionicLoading);
        var responseData = response.d;
        responseData = JSON.parse(responseData.replace('},]', '}]'));
        if (responseData.leaveapprovaldetails !== 'nodata') {
          $scope.leaveDetails = responseData.leaveapprovaldetails;
        } else {
          $scope.leaveDetails = [];
        }
      }, function (error) {
        hideLoading($ionicLoading);
        console.log(error);
      });

      $scope.changeLeaveStatus = function (type) {
        if ($scope.choosed.length > 0) {
          $cordovaDialogs.confirm('Are you sure you want to ' + type + ' ?', 'Confirm', ['Ok', 'Cancel']).then(function (buttonIndex) {
            var btnIndex = buttonIndex;
            if (parseInt(btnIndex) === 1) {
              showLoading($ionicLoading);
              angular.forEach($scope.choosed, function (value) {
                pdata = $scope.leaveDetails[value];
                var postData = {
                  CollegeId: $rootScope.userauth.CollegeId,
                  EmpId: pdata.empid,
                  EmpName: pdata.empname,
                  EmpGroup: pdata.empleavegroup,
                  LeaveType: pdata.leavetype,
                  FromDate: $filter('date')(new Date(pdata.fromdate), 'MM/dd/yyyy'),
                  ToDate: $filter('date')(new Date(pdata.todate), 'MM/dd/yyyy'),
                  noofdays: pdata.noofdays,
                };
                if (type === 'Approve') {
                  SaveLeaveApproval.post(postData, function (response) {
                    console.log(response);
                    toast($cordovaToast, 'Leave Approved', 'long', 'center');
                  }, function (error) {
                    console.log(error);
                  });
                } else {
                  leaveapprovalrejection.post(postData, function (response) {
                    console.log(response);
                    toast($cordovaToast, 'Leave Rejected', 'long', 'center');
                  }, function (error) {
                    console.log(error);
                  });
                }
              });
              hideLoading($ionicLoading);
              $state.reload();
            }
          });
        } else {
          toast($cordovaToast, 'Choose any one leave', 'long', 'center');
        }
      };
      $scope.choosed = [];
      $scope.chooseCheckbox = function (val, isval) {
        if (isval === true) {
          $scope.choosed.push(val);
        } else {
          var index = $scope.choosed.indexOf(val);
          if (index > -1) {
            $scope.choosed.splice(index, 1);
          }
        }
      };
      $scope.refresh = function () {
        $state.reload();
      }
      $scope.isCheckLable = "Check All";
      $scope.selectAll = function (val) {
        if (val === true) {
          $scope.choosed = [];
          angular.forEach($scope.leaveDetails, function (value, key) {
            $scope.choosed.push(key);
          });
          $scope.isCheckLable = "UnChk All";
        } else {
          $scope.choosed = [];
          $scope.isCheckLable = "Check All";
        }
        console.log($scope.choosed);
      };
    } else {
      $state.go('Login');
    }
  })
  .controller('LeavesRecommendController', function ($scope, $rootScope, $state, $filter, $ionicLoading, $cordovaToast, $cordovaDialogs, leaverecommendation, SaveLeaveRecommend, leaverecommendrejection) {
    if (window.localStorage.getItem('auth') !== null) {
      $scope.leaveDetails = [];
      showLoading($ionicLoading);
      var postdata = {
        CollegeId: $rootScope.userauth.CollegeId,
        BranchId: $rootScope.userauth.BranchId,
        EmployeeId: $rootScope.userauth.EmpId,
      };
      leaverecommendation.post(postdata, function (response) {
        hideLoading($ionicLoading);
        var responseData = response.d;
        responseData = JSON.parse(responseData.replace('},]', '}]'));
        if (responseData.leaverecommendationdetails !== 'nodata') {
          $scope.leaveDetails = responseData.leaverecommendationdetails;
        } else {
          $scope.leaveDetails = [];
        }
      }, function (error) {
        hideLoading($ionicLoading);
        console.log(error);
      });

      $scope.changeLeaveStatus = function (type) {
        if ($scope.choosed.length > 0) {
          $cordovaDialogs.confirm('Are you sure you want to ' + type + ' ?', 'Confirm', ['Ok', 'Cancel']).then(function (buttonIndex) {
            var btnIndex = buttonIndex;
            if (parseInt(btnIndex) === 1) {
              showLoading($ionicLoading);
              angular.forEach($scope.choosed, function (value) {
                pdata = $scope.leaveDetails[value];
                if (type === 'Recommend') {
                  var postData = {
                    CollegeId: $rootScope.userauth.CollegeId,
                    EmpId: pdata.empid,
                    group_name: pdata.empleavegroup,
                    leavetype: pdata.leavetype,
                    fromdate: $filter('date')(new Date(pdata.fromdate), 'MM/dd/yyyy'),
                    todate: $filter('date')(new Date(pdata.todate), 'MM/dd/yyyy'),
                    noofdays: pdata.noofdays,
                  };
                  SaveLeaveRecommend.post(postData, function (response) {
                    console.log(response);
                    toast($cordovaToast, 'Leave Recommended', 'long', 'center');
                  }, function (error) {
                    console.log(error);
                  });
                } else {
                  var postData = {
                    CollegeId: $rootScope.userauth.CollegeId,
                    EmpId: pdata.empid,
                    group_name: pdata.empleavegroup,
                    FromDate: $filter('date')(new Date(pdata.fromdate), 'MM/dd/yyyy'),
                    ToDate: $filter('date')(new Date(pdata.todate), 'MM/dd/yyyy'),
                  };
                  leaverecommendrejection.post(postData, function (response) {
                    console.log(response);
                    toast($cordovaToast, 'Leave Rejected', 'long', 'center');
                  }, function (error) {
                    console.log(error);
                  });
                }
              });
              hideLoading($ionicLoading);
              $state.reload();
            }
          });
        } else {
          toast($cordovaToast, 'Choose any one leave', 'long', 'center');
        }
      };
      $scope.choosed = [];
      $scope.chooseCheckbox = function (val, isval) {
        if (isval === true) {
          $scope.choosed.push(val);
        } else {
          var index = $scope.choosed.indexOf(val);
          if (index > -1) {
            $scope.choosed.splice(index, 1);
          }
        }
      };
      $scope.refresh = function () {
        $state.reload();
      }
      $scope.isCheckLable = "Check All";
      $scope.selectAll = function (val) {
        if (val === true) {
          $scope.choosed = [];
          angular.forEach($scope.leaveDetails, function (value, key) {
            $scope.choosed.push(key);
          });
          $scope.isCheckLable = "UnChk All";
        } else {
          $scope.choosed = [];
          $scope.isCheckLable = "Check All";
        }
        console.log($scope.choosed);
      };
    } else {
      $state.go('Login');
    }
  })
  .controller('StaffApprovalController', function ($scope, $rootScope, $state, $filter, $ionicLoading, $cordovaToast, $cordovaDialogs, staffinchargeleaveapproval, savestaffICleave, savestaffICleaverejection) {
    if (window.localStorage.getItem('auth') !== null) {
      $scope.leaveDetails = [];
      showLoading($ionicLoading);
      var postdata = {
        CollegeId: $rootScope.userauth.CollegeId,
        ICEmpId: $rootScope.userauth.EmpId,
      };
      staffinchargeleaveapproval.post(postdata, function (response) {
        hideLoading($ionicLoading);
        var responseData = response.d;
        responseData = JSON.parse(responseData.replace('},]', '}]'));
        if (responseData.staffICleaveapproval !== 'nodata') {
          $scope.leaveDetails = responseData.staffICleaveapproval;
        } else {
          $scope.leaveDetails = [];
        }
      }, function (error) {
        hideLoading($ionicLoading);
        console.log(error);
      });

      $scope.changeLeaveStatus = function (type) {
        if ($scope.choosed.length > 0) {
          $cordovaDialogs.confirm('Are you sure you want to ' + type + ' ?', 'Confirm', ['Ok', 'Cancel']).then(function (buttonIndex) {
            var btnIndex = buttonIndex;
            if (parseInt(btnIndex) === 1) {
              showLoading($ionicLoading);
              angular.forEach($scope.choosed, function (value) {
                pdata = $scope.leaveDetails[value];
                if (type === 'Approve') {
                  var postData = {
                    CollegeId: $rootScope.userauth.CollegeId,
                    EmpId: pdata.empid,
                    EmpName: pdata.empname,
                    EmpGroup: pdata.empleavegroup,
                    LeaveType: pdata.leavetype,
                    FromDate: $filter('date')(new Date(pdata.fromdate), 'MM/dd/yyyy'),
                    ToDate: $filter('date')(new Date(pdata.todate), 'MM/dd/yyyy'),
                    noofdays: pdata.noofdays,
                    staffInchargeId: pdata.inchargeEmpId,
                    staffInchargeName: pdata.inchargeEmpName,
                  };
                  savestaffICleave.post(postData, function (response) {
                    console.log(response);
                    toast($cordovaToast, 'Leave Approved', 'long', 'center');
                  }, function (error) {
                    console.log(error);
                  });
                } else {
                  var postData = {
                    CollegeId: $rootScope.userauth.CollegeId,
                    EmpId: pdata.empid,
                    EmpName: pdata.empname,
                    EmpGroup: pdata.empleavegroup,
                    LeaveType: pdata.leavetype,
                    FromDate: $filter('date')(new Date(pdata.fromdate), 'MM/dd/yyyy'),
                    ToDate: $filter('date')(new Date(pdata.todate), 'MM/dd/yyyy'),
                    noofdays: pdata.noofdays,
                    staffICId: pdata.inchargeEmpId
                  };
                  savestaffICleaverejection.post(postData, function (response) {
                    console.log(response);
                    toast($cordovaToast, 'Leave Rejected', 'long', 'center');
                  }, function (error) {
                    console.log(error);
                  });
                }
              });
              hideLoading($ionicLoading);
              $state.reload();
            }
          });
        } else {
          toast($cordovaToast, 'Choose any one leave', 'long', 'center');
        }
      };
      $scope.choosed = [];
      $scope.chooseCheckbox = function (val, isval) {
        if (isval === true) {
          $scope.choosed.push(val);
        } else {
          var index = $scope.choosed.indexOf(val);
          if (index > -1) {
            $scope.choosed.splice(index, 1);
          }
        }
      };
      $scope.refresh = function () {
        $state.reload();
      }
      $scope.isCheckLable = "Check All";
      $scope.selectAll = function (val) {
        if (val === true) {
          $scope.choosed = [];
          angular.forEach($scope.leaveDetails, function (value, key) {
            $scope.choosed.push(key);
          });
          $scope.isCheckLable = "UnChk All";
        } else {
          $scope.choosed = [];
          $scope.isCheckLable = "Check All";
        }
        console.log($scope.choosed);
      };
    } else {
      $state.go('Login');
    }
  })
  .controller('StudentsLeaveController', function ($scope, $rootScope, $state, $filter, $ionicLoading, $cordovaToast, $cordovaDialogs, GetCourses, GetSemister, GetEmpCourseSubjects, Getsections, GetStudents, getStudentWSec, SaveStuAttendanceApp,getstudentattstatus) {
    $scope.is_show_form = true;
    $scope.isCheckAll = true;
    $scope.data = {};
    $scope.data.attandance = new Date();
    $scope.years = [];
    var dat = new Date();
    var cyear = dat.getFullYear();
    for (i = parseInt(cyear) - 5; i <= parseInt(cyear); i++) {
      $scope.years.push(i);
    }
    showLoading($ionicLoading);
    GetCourses.post({
      CollegeId: $rootScope.userauth.CollegeId,
      BranchId: $rootScope.userauth.BranchId,
      EmpId: $rootScope.userauth.EmpId
    }, function (response) {
      hideLoading($ionicLoading);
      var responseData = response.d;
      responseData = JSON.parse(responseData.replace('},]', '}]'));
      if (responseData.courses !== 'nodata') {
        $scope.courses = responseData.courses;
      } else {
        $scope.courses = [];
      }
    }, function (error) {
      hideLoading($ionicLoading);
      console.log(responseData);
    });
    showLoading($ionicLoading);
    Getsections.post({
      CollegeId: $rootScope.userauth.CollegeId,
      BranchId: $rootScope.userauth.BranchId,
      EmpId: $rootScope.userauth.EmpId
    }, function (response) {
      hideLoading($ionicLoading);
      var responseData = response.d;
      responseData = JSON.parse(responseData.replace('},]', '}]'));
      if (responseData.section !== 'nodata') {
        $scope.section = responseData.section;
      } else {
        $scope.section = [];
      }
    }, function (error) {
      hideLoading($ionicLoading);
      console.log(responseData);
    });
    showLoading($ionicLoading);
    GetSemister.post({
      CollegeId: $rootScope.userauth.CollegeId,
      BranchId: $rootScope.userauth.BranchId
    }, function (response) {
      hideLoading($ionicLoading);
      var responseData = response.d;
      responseData = JSON.parse(responseData.replace('},]', '}]'));
      if (responseData.semester !== 'nodata') {
        $scope.semesters = responseData.semester;
      } else {
        $scope.semesters = [];
      }
    }, function (error) {
      hideLoading($ionicLoading);
      console.log(responseData);
    });
    $scope.getSubject = function (courseCode) {
      if (courseCode !== undefined) {
        GetEmpCourseSubjects.post({
          CollegeId: $rootScope.userauth.CollegeId,
          BranchId: $rootScope.userauth.BranchId,
          EmpId: $rootScope.userauth.EmpId,
          CourseCode: courseCode
        }, function (response) {
          hideLoading($ionicLoading);
          var responseData = response.d;
          responseData = JSON.parse(responseData.replace('},]', '}]'));
          if (responseData.subjects !== 'nodata') {
            $scope.subjects = responseData.subjects;
          } else {
            $scope.subjects = [];
          }
        }, function (error) {
          hideLoading($ionicLoading);
          console.log(responseData);
        });
      }
    };


    $scope.findStudent = function ($valid, data) {
      if ($valid) {
        showLoading($ionicLoading);
        $scope.formData = data;
        var searchParams = {
          CollegeId: $rootScope.userauth.CollegeId,
          BranchId: $rootScope.userauth.BranchId,
          Class: (data.courseSelect !== undefined) ? data.courseSelect : '',
          cmbyears: data.yearSelect,
          Semister: (data.sems !== undefined) ? data.sems : '',
          Section: (data.section !== undefined) ? data.section : '',
          Name: '',
          stuID: ''
        };
        getStudentWSec.post(searchParams, function (response) {
          hideLoading($ionicLoading);
          var responseData = response.d;
          if (responseData.indexOf('nodata') === -1) {
            responseData = responseData.replace('},]', '}').replace('}}', '}]}');
            responseData = JSON.parse(responseData);
            $scope.students = responseData.studentdata;
            $scope.students.count = $scope.students[Object.keys($scope.students).length - 1];
            $scope.students.pop();
            $scope.is_show_form = false;
            $scope.choosed = [];

            showLoading($ionicLoading);
            $scope.formData = data;
            var getParams = {
                CollegeId: $rootScope.userauth.CollegeId,
                BranchId: $rootScope.userauth.BranchId,
                EmpId: $rootScope.userauth.EmpId,
                CourseCode: (data.courseSelect !== undefined) ? data.courseSelect : '',
                SubCode: (data.subject !== undefined) ? data.subject : '',
                DateAtt: $filter('date')($scope.data.attandance, 'MM/dd/yyyy'),
                StatusAtt: (data.status !== undefined) ? data.status : ''
            };
            console.log(getParams);
            getstudentattstatus.post(getParams, function (response) {
                hideLoading($ionicLoading);
                var responseData = response.d;
                console.log(responseData);
                if (responseData.indexOf('nodata') === -1) {
                    responseData = JSON.parse(responseData.replace('},]', '}]'));
                    if (responseData.studentlist !== 'nodata') {
                        $scope.attendance = responseData.studentlist; 
                    } else {
                        $scope.attendance = [];
                    }
                } else {
                    $scope.attendance = [];
                    toast($cordovaToast, 'No students data', 'long', 'bottom');
                }
            });
            angular.forEach($scope.students, function (value, key) {
                angular.forEach($scope.attendance, function (attend) {
                    console.log('value:',value,'attend:',attend);
                });
              //$scope.choosed.push(key);
            });
            //console.log($scope.choosed);
          } else {
            $scope.students = [];
            toast($cordovaToast, 'No students data', 'long', 'bottom');
          }
        });
      }
    };

    $scope.isCheckLable = "Check All";
    $scope.selectAll = function (val) {
      if (val === true) {
        $scope.choosed = [];
        angular.forEach($scope.students, function (value, key) {
          $scope.choosed.push(key);
        });
        $scope.isCheckLable = "UnChk All";
      } else {
        $scope.choosed = [];
        $scope.isCheckLable = "Check All";
      }
      console.log($scope.choosed);
    };

    $scope.chooseCheckbox = function (val, isval) {
      if (isval === true) {
        $scope.choosed.push(val);
      } else {
        var index = $scope.choosed.indexOf(val);
        if (index > -1) {
          $scope.choosed.splice(index, 1);
        }
      }
      console.log($scope.choosed);
    };

    $scope.cancel = function () {
      $scope.is_show_form = true;
    };

    $scope.doattandance = function (cdate) {
      if (cdate !== undefined) {
        $scope.Present = [];
        $scope.Absent = [];
        angular.forEach($scope.students, function (value, key) {
          if ($scope.choosed.indexOf(key) > -1) {
            $scope.Present.push(value.studentid, value.regno, 'Present');
          } else {
            $scope.Absent.push(value.studentid, value.regno, 'Absent');
          }
        });
        var studDetail = $scope.Present.toString() + ',' + $scope.Absent.toString();
        if (studDetail.indexOf(',') === 0) {
          studDetail = studDetail.substr(1);
        }

        var leaveParams = {
          CollegeId: $rootScope.userauth.CollegeId,
          BranchId: $rootScope.userauth.BranchId,
          EmpID: $rootScope.userauth.EmpId,
          SubCode: $scope.formData.subject,
          CourseCode: $scope.formData.courseSelect,
          Semister: $scope.formData.sems,
          Section: ($scope.formData.section !== undefined) ? $scope.formData.section : 'Null',
          Year: $scope.formData.yearSelect,
          DateAtt: $filter('date')(cdate, 'MM/dd/yyyy'),
          StuDetails: studDetail
        };
        SaveStuAttendanceApp.post(leaveParams, function (response) {
          if (response.d !== 'Fail') {
            toast($cordovaToast, 'Attandance added successfully', 'long', 'center');
            $state.go('mobix.Dashboard');
          } else {
            toast($cordovaToast, 'Attandance added failed', 'long', 'center');
          }
        })
      } else {
        toast($cordovaToast, 'Choose date', 'long', 'center');
      }
    }
  })
  .controller('StudentAbsentCtrl', function ($scope, $rootScope, $state, $filter, $ionicLoading, $cordovaToast, $cordovaDialogs, GetCourses, GetSemister, GetEmpCourseSubjects, Getsections, GetStudents, getStudentWSec, getstudentattstatus) {
    $scope.is_show_form = true;
    $scope.isCheckAll = true;
    $scope.data = {};
    $scope.data.attandance = new Date();

    showLoading($ionicLoading);
    GetCourses.post({
      CollegeId: $rootScope.userauth.CollegeId,
      BranchId: $rootScope.userauth.BranchId,
      EmpId: $rootScope.userauth.EmpId
    }, function (response) {
      hideLoading($ionicLoading);
      var responseData = response.d;
      responseData = JSON.parse(responseData.replace('},]', '}]'));
      if (responseData.courses !== 'nodata') {
        $scope.courses = responseData.courses;
      } else {
        $scope.courses = [];
      }
    }, function (error) {
      hideLoading($ionicLoading);
      console.log(responseData);
    });
    $scope.getSubject = function (courseCode) {
      if (courseCode !== undefined) {
        showLoading($ionicLoading);
        GetEmpCourseSubjects.post({
          CollegeId: $rootScope.userauth.CollegeId,
          BranchId: $rootScope.userauth.BranchId,
          EmpId: $rootScope.userauth.EmpId,
          CourseCode: courseCode
        }, function (response) {
          hideLoading($ionicLoading);
          var responseData = response.d;
          responseData = JSON.parse(responseData.replace('},]', '}]'));
          if (responseData.subjects !== 'nodata') {
            $scope.subjects = responseData.subjects;
          } else {
            $scope.subjects = [];
          }
        }, function (error) {
          hideLoading($ionicLoading);
          console.log(responseData);
        });
      }
    }
    $scope.findStudent = function ($valid, data) {
      if ($valid) {
        showLoading($ionicLoading);
        $scope.formData = data;
        var searchParams = {
          CollegeId: $rootScope.userauth.CollegeId,
          BranchId: $rootScope.userauth.BranchId,
          EmpId: $rootScope.userauth.EmpId,
          CourseCode: (data.courseSelect !== undefined) ? data.courseSelect : '',
          SubCode: (data.subject !== undefined) ? data.subject : '',
          DateAtt: $filter('date')(data.attandance, 'MM/dd/yyyy'),
          StatusAtt: (data.status !== undefined) ? data.status : ''
        };
        getstudentattstatus.post(searchParams, function (response) {
          hideLoading($ionicLoading);
          var responseData = response.d;
          if (responseData.indexOf('nodata') === -1) {
            responseData = JSON.parse(responseData.replace('},]', '}]'));
            if (responseData.studentlist !== 'nodata') {
                $scope.students = responseData.studentlist;
                $scope.is_show_form = false;
            } else {
                $scope.students = [];
            }
          } else {
            $scope.students = [];
            toast($cordovaToast, 'No students data', 'long', 'bottom');
          }
        });
      }
    };

    $scope.cancel = function () {
      $scope.is_show_form = true;
    };
  });

"use strict";
angular.module('mobix')
    .controller('LoginController', function($scope, $rootScope, $state, $ionicLoading, $cordovaToast, Login, UpdateDevice) {
        if (window.localStorage.getItem('auth') === null) {
            $scope.data = {};
            //$scope.data = {
            //    UserName: 'shlrdemo',
            //    Password: 'shlrdemo@123'
            //};
            $scope.loginSubmit = function($valid, data) {
                if ($valid) {
                    showLoading($ionicLoading);
                    Login.post(data, function(response) {
                        hideLoading($ionicLoading);
                        $scope.edata = JSON.parse(response.d);
                        if ($scope.edata.user !== 'nodata') {
                            $scope.edata.user['EmpId'] = data.UserName;
                            storeLocal('auth', btoa(JSON.stringify($scope.edata.user)));
                            //$state.go('mobix.Dashboard');

                            var devType = 1;
                            if (angular.lowercase($rootScope.deviceInformation.platform) !== 'android') {
                                devType = 2;
                            }
                            var postParam = {
                                CollegeId: $scope.edata.user.CollegeId,
                                BranchId: $scope.edata.user.BranchId,
                                EmpId: $scope.edata.user.EmpId,
                                devicetoken: getLocal('devicetoken'),
                                devicetype: devType
                            }
                            UpdateDevice.post(postParam, function(response) {
                                console.log(response);
                                $state.go('mobix.Dashboard');
                            }, function(error) {
                                $state.go('mobix.Dashboard');
                            })

                        } else {
                            hideLoading($ionicLoading);
                            toast($cordovaToast, 'Login Failed', 'long', 'center');
                        }
                    }, function(error) {
                        hideLoading($ionicLoading);
                        toast($cordovaToast, 'Login Failed', 'long', 'center');
                    });
                }
            }
        } else {
            $state.go('mobix.Dashboard');
        }
    })
"use strict";
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
    .controller('AppController', function($scope, $rootScope, $state, $ionicPopup, $timeout, $location, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $window, $timeout, $ionicConfig) {
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
"use strict";
angular.module('mobix')
    .controller('BulkSMSController', function($scope, $rootScope, $state, $ionicLoading, $cordovaToast, GetCoursesAdmin, GetSemister, getStudentsAll, GetMessageTemplate, GetSMSTemplate, sendBulkSMSNew) {
        if (window.localStorage.getItem('auth') !== null) {
            $scope.years = [];
            $scope.messageData = {};
            $scope.isFilterShow = true;
            $scope.isMsgBoxShow = false;
            var dat = new Date();
            var cyear = dat.getFullYear();
            for (i = parseInt(cyear) - 5; i <= parseInt(cyear); i++) {
                $scope.years.push(i);
            }
            showLoading($ionicLoading);
            GetCoursesAdmin.post({ CollegeId: $rootScope.userauth.CollegeId, BranchId: $rootScope.userauth.BranchId }, function(response) {
                hideLoading($ionicLoading);
                var responseData = response.d;
                responseData = JSON.parse(responseData.replace('},]', '}]'));
                if (responseData.courses !== 'nodata') {
                    $scope.courses = responseData.courses;
                } else {
                    $scope.courses = [];
                }
            }, function(error) {
                hideLoading($ionicLoading);
                console.log(responseData);
            });

            showLoading($ionicLoading);
            GetSemister.post({ CollegeId: $rootScope.userauth.CollegeId, BranchId: $rootScope.userauth.BranchId }, function(response) {
                hideLoading($ionicLoading);
                var responseData = response.d;
                responseData = JSON.parse(responseData.replace('},]', '}]'));
                if (responseData.semester !== 'nodata') {
                    $scope.semester = responseData.semester;
                } else {
                    $scope.semester = [];
                }
            }, function(error) {
                hideLoading($ionicLoading);
                console.log(responseData);
            });

            $scope.findStudent = function($valid, data) {
                if ($valid) {
                    var searchParams = {
                        CollegeId: $rootScope.userauth.CollegeId,
                        BranchId: $rootScope.userauth.BranchId,
                        cmbyears: data.yearSelect,
                        Semister: (data.semSelect !== undefined) ? data.semSelect : '',
                        Name: (data.name !== undefined) ? data.name : '',
                        stuID: (data.stuid !== undefined) ? data.stuid : '',
                        Class: (data.courseSelect !== undefined) ? data.courseSelect : ''
                    }

                    showLoading($ionicLoading);
                    getStudentsAll.post(searchParams, function(response) {
                        hideLoading($ionicLoading);
                        console.log(response);
                        responseData = response.d;
                        if (responseData.studentdata !== 'nodata') {
                            $scope.sudents = {};
                            responseData = responseData.replace('},],{', '}],').replace('"}}', '"}').replace(/(\r\n|\n|\r)/gm, "");
                            responseData = JSON.parse(responseData);
                            $scope.sudents = responseData.studentdata;
                            $scope.totalRecords = responseData.stucount;
                            $scope.isFilterShow = false;
                        } else {
                            $scope.sudents = [];
                        }
                    }, function(error) {
                        hideLoading($ionicLoading);
                        toast($cordovaToast, 'Student List could not be displayed. Choose other filters and Submit', 'long', 'center');
                        console.log('getStudentsAll error', error)
                    });
                }
            };
            $scope.choosed = [];
            $scope.parentno = [];
            $scope.chooseCheckbox = function (val, val1, isval) {
                if (isval === true) {
                    $scope.choosed.push(val);
                    $scope.parentno.push(val1);
                } else {
                    var index = $scope.choosed.indexOf(val);
                    var index1 = $scope.parentno.indexOf(val1);
                    if (index > -1) {
                        $scope.choosed.splice(index, 1);
                    }
                    if (index > -1)
                        {
                            $scope.parentno.splice(index1, 1);
                        }
                    
                }
            };
            $scope.isCheckLable = "CheckAll";
            $scope.selectAll = function(val) {
                if (val === true) {
                    $scope.choosed = [];
                    $scope.parentno = [];
                    angular.forEach($scope.sudents, function(value) {
                        $scope.choosed.push(value.contactnumber);
                        $scope.parentno.push(value.parentsphone);
                    });
                    $scope.isCheckLable = "UnChkAll";
                } else {
                    $scope.choosed = [];
                    $scope.parentno = [];
                    $scope.isCheckLable = "CheckAll";
                }
                /*console.log($scope.choosed);*/
            };


            $scope.studentflag = [];
            $scope.studentcheck = function (val, isval) {
                if (isval === true) {
                    $scope.studentflag.push(val);
                } else {
                    var index = $scope.studentflag.indexOf(val);
                    if (index > -1) {
                        $scope.studentflag.splice(index, 1);
                    }
                }
            };

            $scope.parentflag = [];
            $scope.parentcheck = function (val, isval) {
                if (isval === true) {
                    $scope.parentflag.push(val);
                } else {
                    var index = $scope.parentflag.indexOf(val);
                    if (index > -1) {
                        $scope.parentflag.splice(index, 1);
                    }
                }
            };
          
            
            $scope.showMsgTemplate = function() {
                if ($scope.choosed.length > 0) {
                    $scope.isMsgBoxShow = true;
                    showLoading($ionicLoading);
                    GetMessageTemplate.post({ CollegeId: $rootScope.userauth.CollegeId, BranchId: $rootScope.userauth.BranchId }, function(response) {
                        hideLoading($ionicLoading);
                        responseData = response.d;
                        if (responseData.messagetemplate !== 'nodata') {
                            responseData = responseData.replace('},]', '}]');
                            responseData = JSON.parse(responseData);
                            $scope.msgTemplates = responseData.messagetemplate;
                        } else {
                            $scope.msgTemplates = [];
                        }
                    }, function(error) {
                        hideLoading($ionicLoading);
                        console.log('GetMessageTemplate error', error)
                    });
                } else {
                    toast($cordovaToast, 'Select Atleast One Student', 'long', 'center');
                }
            };

            $scope.backtoFilter = function() {
                $scope.isFilterShow = true;
            }

            $scope.backtoFilter2 = function(){
                $scope.isMsgBoxShow = false;
            }
            $scope.messageTemplate = function(valu){
                if(valu){
                    showLoading($ionicLoading);
                    GetSMSTemplate.post({ CollegeId: $rootScope.userauth.CollegeId, BranchId: $rootScope.userauth.BranchId, MessageCode: valu}, function(response){
                        hideLoading($ionicLoading);
                         responseData = response.d;
                         if (responseData.message !== 'nodata') {
                            //responseData = responseData.replace('},]', '}]');
                            responseData = JSON.parse(responseData);
                            $scope.messageData.writeMsg = responseData.message[0]['msgdetails'];
                        } else {
                            $scope.messageData.writeMsg = {};
                        }
                    })
                }
            };

            $scope.sendBulkMessage = function($valid, data){
                if($valid){
                    showLoading($ionicLoading);
                    var sflag = $scope.studentflag.getUnique();
                    var pflag = $scope.parentflag.getUnique();
                    var mobileArray = $scope.choosed.getUnique();
                    var mobileArray1 = $scope.parentno.getUnique();

                    if (sflag==1 && pflag==1)
                    {
                    var postDatas = {
                        CollegeId: $rootScope.userauth.CollegeId,
                        contactnumbers: mobileArray.toString() + "," + mobileArray1.toString(),
                        smskey: 'SHLRTechSMS',
                        message: data.writeMsg
                        }
                    }
                    else if (sflag==1) {
                        var postDatas = {
                            CollegeId: $rootScope.userauth.CollegeId,
                            contactnumbers: mobileArray.toString(),
                            smskey: 'SHLRTechSMS',
                            message: data.writeMsg
                        }
                    }
                    else if (pflag==1) {
                        var postDatas = {
                            CollegeId: $rootScope.userauth.CollegeId,
                            contactnumbers: mobileArray1.toString(),
                            smskey: 'SHLRTechSMS',
                            message: data.writeMsg
                        }
                    }
                    sendBulkSMSNew.post(postDatas, function(response){
                        console.log(response);
                        if(response.d === 'Success'){
                            hideLoading($ionicLoading);
                            $state.go('mobix.Dashboard');
                            toast($cordovaToast, 'SMS Sent Successfully', 'long', 'center');
                        }
                    }, function(error){
                        hideLoading($ionicLoading);
                        toast($cordovaToast, 'Message could not be sent, Try Again Later. ', 'long', 'center');
                        console.log(error);
                    });
                }
            }
        } else {
            $state.go('Login', {}, {
                reload: true
            });
        }
    })
    .controller('BulkSMSStaffController', function($scope, $rootScope, $state, $ionicLoading, $cordovaToast, getEmpData, GetDepartments, GetCoursesAdmin, getJobTitle, GetMessageTemplate, GetSMSTemplate, sendBulkSMSNew) {
        if (window.localStorage.getItem('auth') !== null) {
            $scope.messageData = {};
            $scope.isFilterShow = true;
            $scope.isMsgBoxShow = false;
            $scope.data = {};
            
            showLoading($ionicLoading);
            GetDepartments.post({CollegeId: $rootScope.userauth.CollegeId, BranchId: $rootScope.userauth.BranchId}, function(response) {
                hideLoading($ionicLoading);
                var responseData = response.d;
                responseData = JSON.parse(responseData.replace('},]', '}]'));
                if (responseData.dept !== 'nodata') {
                    $scope.departments = responseData.dept;
                } else {
                    $scope.departments = [];
                }
            }, function(error) {
                hideLoading($ionicLoading);
                console.log(responseData);
            });

            showLoading($ionicLoading);
            GetCoursesAdmin.post({ CollegeId: $rootScope.userauth.CollegeId, BranchId: $rootScope.userauth.BranchId }, function(response) {
                hideLoading($ionicLoading);
                var responseData = response.d;
                responseData = JSON.parse(responseData.replace('},]', '}]'));
                if (responseData.courses !== 'nodata') {
                    $scope.cources = responseData.courses;
                } else {
                    $scope.cources = [];
                }
            }, function(error) {
                hideLoading($ionicLoading);
                console.log(responseData);
            });

            showLoading($ionicLoading);
                getJobTitle.post({ CollegeId: $rootScope.userauth.CollegeId, BranchId: $rootScope.userauth.BranchId }, function(response) {
                    hideLoading($ionicLoading);
                    var responseData = response.d;
                    responseData = JSON.parse(responseData.replace('},]', '}]'));
                    if (responseData.jobtitle !== 'nodata') {
                        $scope.jobTitles = responseData.jobtitle;
                    } else {
                        $scope.jobTitles = [];
                    }
                }, function(error) {
                    hideLoading($ionicLoading);
                    console.log(responseData);
                });

            $scope.findSaffs = function($valid, data) {
                if ($valid) {
                    var searchParams = {
                        CollegeId: $rootScope.userauth.CollegeId,
                        BranchId: $rootScope.userauth.BranchId,
                        jobt: (data.jobTit !== undefined) ? data.jobTit : '',
                        empname: (data.name !== undefined) ? data.name : '',
                        coursecode: (data.courseSelect !== undefined) ? data.courseSelect : '',
                        dept: (data.deptSel !== undefined) ? data.deptSel : ''
                    }
                    showLoading($ionicLoading);
                    getEmpData.post(searchParams, function(response) {
                        hideLoading($ionicLoading); 
                        responseData = response.d;
                        if (responseData.indexOf('nodata') === -1) {
                            $scope.empdatas = {};
                            responseData = responseData.replace('},]', '}]').replace(/(\r\n|\n|\r)/gm, "");
                            responseData = JSON.parse(responseData);
                            console.log(responseData);
                            $scope.empdatas = responseData.empdata;
                            $scope.totalRecords = Object.keys(responseData.empdata).length;
                            $scope.isFilterShow = false;
                        } else {
                            $scope.empdatas = [];
                        }
                    }, function(error) {
                        hideLoading($ionicLoading);
                        toast($cordovaToast, 'Staff List could not be displayed. Try other filters and Submit', 'long', 'center');
                        console.log('getEmpData error', error)
                    });
                }
            };
            $scope.choosed = [];
            $scope.chooseCheckbox = function(val, isval) {
                if (isval === true) {
                    $scope.choosed.push(val);
                } else {
                    var index = $scope.choosed.indexOf(val);
                    if (index > -1) {
                        $scope.choosed.splice(index, 1);
                    }
                }
            };
            $scope.isCheckLable = "CheckAll";
            $scope.selectAll = function(val) {
                if (val === true) {
                    $scope.choosed = [];
                    angular.forEach($scope.empdatas, function(value) {
                        $scope.choosed.push(value.contact);
                    });
                    $scope.isCheckLable = "UnChkAll";
                } else {
                    $scope.choosed = [];
                    $scope.isCheckLable = "CheckAll";
                }
                console.log($scope.choosed);
            };

            $scope.showMsgTemplate = function() {
                if ($scope.choosed.length > 0) {
                    $scope.isMsgBoxShow = true;
                    showLoading($ionicLoading);
                    GetMessageTemplate.post({ CollegeId: $rootScope.userauth.CollegeId, BranchId: $rootScope.userauth.BranchId }, function(response) {
                        hideLoading($ionicLoading);
                        responseData = response.d;
                        if (responseData.messagetemplate !== 'nodata') {
                            responseData = responseData.replace('},]', '}]');
                            responseData = JSON.parse(responseData);
                            $scope.msgTemplates = responseData.messagetemplate;
                        } else {
                            $scope.msgTemplates = [];
                        }
                    }, function(error) {
                        hideLoading($ionicLoading);
                        console.log('GetMessageTemplate error', error)
                    });
                } else {
                    toast($cordovaToast, 'Select atleast One Student', 'long', 'center');
                }
            };

            $scope.backtoFilter = function() {
                $scope.isFilterShow = true;
            }

            $scope.messageTemplate = function(valu){
                if(valu){
                    showLoading($ionicLoading);
                    GetSMSTemplate.post({ CollegeId: $rootScope.userauth.CollegeId, BranchId: $rootScope.userauth.BranchId, MessageCode: valu}, function(response){
                        hideLoading($ionicLoading);
                         responseData = response.d;
                         if (responseData.message !== 'nodata') {
                            //responseData = responseData.replace('},]', '}]');
                            responseData = JSON.parse(responseData);
                            $scope.messageData.writeMsg = responseData.message[0]['msgdetails'];
                        } else {
                            $scope.messageData.writeMsg = {};
                        }
                    })
                }
            };

            $scope.sendBulkMessage = function($valid, data){
                if($valid){
                    showLoading($ionicLoading);
                     var mobileArray = $scope.choosed.getUnique();
                    var postDatas = {
                        CollegeId: $rootScope.userauth.CollegeId,
                        contactnumbers: /*'9655330518',*/mobileArray.toString(),
                        smskey: 'SHLRTechSMS',
                        message: data.writeMsg
                    }
                    //console.log(postDatas);
                    sendBulkSMSNew.post(postDatas, function(response){
                        hideLoading($ionicLoading);
                        if(response.d === 'Success'){
                            $state.go('mobix.Dashboard');
                            toast($cordovaToast, 'Successfully message sent', 'long', 'center');
                        }
                    }, function(error){
                        console.log(error);
                    })
                }
            }
        } else {
            $state.go('Login', {}, {
                reload: true
            });
        }
    });

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}
"use strict";
angular.module('mobix')
    .controller('StudentsController', function($scope, $rootScope, $state, $ionicLoading, $cordovaToast, GetStudents) {
        if (window.localStorage.getItem('auth') !== null) {
            $scope.students = [];
            $scope.years = [];
            var d = new Date();
            var cyear = d.getFullYear();
            for (i = parseInt(cyear) - 5; i <= parseInt(cyear); i++) {
                $scope.years.push(i);
            }
            $scope.selectYear = function(yer) {
                showLoading($ionicLoading);
                var postdata = {
                    CollegeId: $rootScope.userauth.CollegeId,
                    BranchId: $rootScope.userauth.BranchId,
                    EmpId: $rootScope.userauth.EmpId,
                    Year: yer
                }
                GetStudents.post(postdata, function(response) {
                    hideLoading($ionicLoading);
                    var responseData = response.d;
                    responseData = JSON.parse(responseData.replace('},]', '}]'));
                    if (responseData.students !== 'nodata') {
                        $scope.students = responseData.students;
                    } else {
                        $scope.students = [];
                    }
                }, function(error) {
                    hideLoading($ionicLoading);
                    console.log(responseData);
                });
            };
        } else {
            $state.go('Login', {}, {
                reload: true
            });
        }

    })
"use strict";
angular.module('mobix')
.controller('SubjectsHandleController', function($scope, $rootScope, $state, $ionicLoading, $cordovaToast, GetClassHandlings, GetSubjects, GetCourses) {
    if (window.localStorage.getItem('auth') !== null) {
        var postdata = {
            CollegeId: $rootScope.userauth.CollegeId,
            BranchId: $rootScope.userauth.BranchId,
            EmpId: $rootScope.userauth.EmpId
        };
        $scope.classHandling = $scope.subjects = $scope.cources =[];
        showLoading($ionicLoading);
        GetSubjects.post(postdata, function(response) {
            hideLoading($ionicLoading);
            var responseData = response.d;
            responseData = JSON.parse(responseData.replace('},]', '}]'));
            if (responseData.subjects !== 'nodata') {
                $scope.subjects = responseData.subjects;
            } else {
                $scope.subjects = [];
            }
        }, function(error) {
            hideLoading($ionicLoading);
            console.log(responseData);
        });
        
        showLoading($ionicLoading);
        GetCourses.post(postdata, function(response) {
            hideLoading($ionicLoading);
            var responseData = response.d;
            responseData = JSON.parse(responseData.replace('},]', '}]'));
            if (responseData.courses !== 'nodata') {
                $scope.cources = responseData.courses;
            } else {
                $scope.cources = [];
            }
        }, function(error) {
            hideLoading($ionicLoading);
            console.log(responseData);
        });

        showLoading($ionicLoading);
        GetClassHandlings.post(postdata, function(response) {
            hideLoading($ionicLoading);
            var responseData = response.d;
            responseData = JSON.parse(responseData.replace('},]', '}]'));
            if (responseData.clases !== 'nodata') {
                $scope.classHandling = responseData.clases;
            } else {
                $scope.classHandling = [];
            }
        }, function(error) {
            hideLoading($ionicLoading);
            console.log(responseData);
        });


        
    } else {
        $state.go('Login', {}, {
            reload: true
        });
    }
})
.directive('subShow', function(){
    return {
        restrict:'EA',
        replace: true,
        template: "<span> {{subjectName}} </span>",
        scope:{
            subject:'@',
            subjects:'@'
        },
        link: function(scope, element, attr){
            
            var subs = JSON.parse(scope.subjects);
            console.log(subs);
            if(subs){
                for (var i=0 ; i < subs.length ; i++) {
                    if (subs[i]['code'] === scope.subject) {
                        scope.subjectName = subs[i]['subject'];
                    }
                }
            }
        }
    }
})
.directive('courShow', function(){
    return {
        restrict:'EA',
        replace: true,
        template: "<span> {{courseName}} </span>",
        scope:{
            cource:'@',
            cources:'@',
        },
        link: function(scope, element, attr){
            var cour = JSON.parse(scope.cources);
            if(cour){
                for (var i=0 ; i < cour.length ; i++) {
                    if (cour[i]['code'] === scope.cource) {
                        scope.courseName = cour[i]['course'];
                    }
                }
            }
        }
    }
})
"use strict";
angular.module('mobix')
    .controller('TimeTableController', function($scope, $rootScope, $state, $filter, $ionicLoading, $cordovaToast, $cordovaDialogs, getTimeTable, GetCourses, GetCoursesAdmin) {
        if (window.localStorage.getItem('auth') !== null) {
            $scope.years = [];
            var d = new Date();
            var cyear = d.getFullYear();
            for (i = parseInt(cyear) - 5; i <= parseInt(cyear); i++) {
                $scope.years.push(i);
            }
            var postdata = {
                CollegeId: $rootScope.userauth.CollegeId,
                BranchId: $rootScope.userauth.BranchId,
                EmpId: $rootScope.userauth.EmpId
            };

            console.log($rootScope.userauth);
            if (parseInt($rootScope.userauth.RoleId) === 1) {
                showLoading($ionicLoading);
                GetCoursesAdmin.post({ CollegeId: $rootScope.userauth.CollegeId, BranchId: $rootScope.userauth.BranchId }, function(response) {
                    hideLoading($ionicLoading);
                    var responseData = response.d;
                    responseData = JSON.parse(responseData.replace('},]', '}]'));
                    if (responseData.courses !== 'nodata') {
                        $scope.cources = responseData.courses;
                    } else {
                        $scope.cources = [];
                    }
                }, function(error) {
                    hideLoading($ionicLoading);
                    console.log(responseData);
                });
            } else {
                showLoading($ionicLoading);
                GetCourses.post(postdata, function(response) {
                    hideLoading($ionicLoading);
                    var responseData = response.d;
                    responseData = JSON.parse(responseData.replace('},]', '}]'));
                    if (responseData.courses !== 'nodata') {
                        $scope.cources = responseData.courses;
                    } else {
                        $scope.cources = [];
                    }
                }, function(error) {
                    hideLoading($ionicLoading);
                    console.log(responseData);
                });
            }

            $scope.getTimeTables = function($valid, data) {
                if ($valid) {
                    showLoading($ionicLoading);
                    var postdata = {
                        CollegeId: $rootScope.userauth.CollegeId,
                        BranchId: $rootScope.userauth.BranchId,
                        Year: data.yearSelect,
                        CourseId: data.courseSelect
                    }
                    getTimeTable.post(postdata, function(response) {
                        hideLoading($ionicLoading);
                        var responseData = response.d;
                        responseData = JSON.parse(responseData.replace('},]', '}]'));
                        if (responseData.TimeTable !== 'nodata') {
                            data = responseData.TimeTable;
                            $scope.timtables = {
                                menu: data.slice(0, 9),
                                mon: data.slice(10, 18),
                                tue: data.slice(19, 27),
                                wed: data.slice(28, 36),
                                thu: data.slice(37, 45),
                                fri: data.slice(46, 54),
                                sat: data.slice(55, 63)
                            };
                            $scope.isShown = true;
                        } else {
                            $scope.timtables = [];
                            $scope.isShown = false;
                        }
                    }, function(error) {
                        hideLoading($ionicLoading);
                        console.log(responseData);
                    });
                }
            }
        } else {
            $state.go('Login', {}, {
                reload: true
            });
        }
    })
    .filter('NoData', function($filter) {
        return function(input) {
            if (input == 'NoData') { return "-"; }
            return input;
        };
    })
    .controller('EventsController', function($scope, $rootScope, $state, $filter, $ionicLoading, $cordovaToast, $cordovaDialogs, $cordovaCalendar, GetEvents) {
        $scope.years = [];
        var dat = new Date();
        var cyear = dat.getFullYear();
        for (i = parseInt(cyear) - 5; i <= parseInt(cyear); i++) {
            $scope.years.push(i);
        }
        $scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $scope.getEvents = function($valid, data) {
            if ($valid) {
                var postdata = {
                    CollegeId: $rootScope.userauth.CollegeId,
                    BranchId: $rootScope.userauth.BranchId,
                    month: data.monthSelect,
                    year: data.yearSelect
                };
                GetEvents.post(postdata, function(response) {
                    hideLoading($ionicLoading);
                    var responseData = response.d;
                    responseData = JSON.parse(responseData.replace('},]', '}]'));
                    if (responseData.events !== 'nodata') {
                        $scope.events = [];
                        angular.forEach(responseData.events, function(value) {
                            /* startDate = value.startdate;
                             startDate = startDate.split('/');
                             enddate = value.enddate;
                             enddate = enddate.split('/');*/
                            $scope.events.push({
                                title: value.title,
                                /*start: new Date(startDate[1] + '/' + startDate[0] + '/' + startDate[2]),
                                end: new Date(enddate[1] + '/' + enddate[0] + '/' + enddate[2]),*/
                                start: new Date(value.startdate),
                                end: new Date(value.enddate),
                                className: ['openSesame']
                            });
                        });
                        $scope.isShown = true;
                        $scope.uiConfig = {
                            calendar: {
                                height: 450,
                                editable: true,
                                header: {
                                    left: 'title',
                                    center: '',
                                    right: 'today prev,next',
                                    //gotoDate: new date('05/01/2016')
                                },
                                eventRender: $scope.eventRender
                            }
                        };

                        /* event sources array*/
                        $scope.eventSources = [$scope.events];
                    } else {
                        $scope.events = [];
                        $scope.isShown = false;
                    }
                }, function(error) {
                    hideLoading($ionicLoading);
                    console.log(responseData);
                });
            }
        }
    });