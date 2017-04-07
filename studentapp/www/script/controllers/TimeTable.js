angular.module('mobix')
    .controller('TimeTableController', function($scope, $rootScope, $state, $filter, $ionicLoading, $cordovaToast, $cordovaDialogs, getTimeTable, GetCourses) {
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