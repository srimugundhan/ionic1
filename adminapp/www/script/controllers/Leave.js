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
  .controller('StudentsLeaveController', function ($scope, $rootScope, $state, $filter, $ionicLoading, $cordovaToast, $cordovaDialogs, GetCourses, GetSemister, GetEmpCourseSubjects, Getsections, GetStudents, getStudentWSec, SaveStuAttendanceApp, getstudentattstatus) {
    $scope.is_show_form = true;
    $scope.isCheckAll = true;
    $scope.is_show_submit_button = true;
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
              StatusAtt: 'Present'
            };
            getstudentattstatus.post(getParams, function (response) {
              hideLoading($ionicLoading);
              var responseData = response.d;
              if (responseData.indexOf('nodata') === -1) {
                responseData = JSON.parse(responseData.replace('},]', '}]'));
                if (responseData.studentlist !== 'nodata') {
                  $scope.isCheckAll = false;
                  $scope.attendance = responseData.studentlist;
                  angular.forEach($scope.students, function (value, key) {
                    angular.forEach($scope.attendance, function (attend) {
                      //console.log('value:',value,'attend:',attend);
                      if (value.regno == attend.registerno) {
                        $scope.choosed.push(key);
                        value.is_present = true;
                      }
                    });
                  });
                } else {
                  $scope.attendance = [];
                  angular.forEach($scope.students, function (value, key) {
                    $scope.choosed.push(key);
                  });
                }
              } else {
                $scope.attendance = [];
                angular.forEach($scope.students, function (value, key) {
                  $scope.choosed.push(key);
                });
              }
            });
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
        $scope.attendance = [];
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
      $scope.is_show_form = $scope.is_show_submit_button = true;
    };

    $scope.doattandance = function (cdate) {
      if (cdate !== undefined) {
        $scope.caldate = cdate;
        $scope.Present = [];
        $scope.Absent = [];
        $scope.smsAbs = [];
        angular.forEach($scope.students, function (value, key) {
          if ($scope.choosed.indexOf(key) > -1) {
            $scope.Present.push(value.studentid, value.regno, 'Present');
          } else {
            $scope.Absent.push(value.studentid, value.regno, 'Absent');
            $scope.smsAbs.push(value.studentid);
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
            $scope.is_show_submit_button = false;
            //$state.go('mobix.Dashboard');
          } else {
            toast($cordovaToast, 'Attandance added failed', 'long', 'center');
          }
        })
      } else {
        toast($cordovaToast, 'Choose date', 'long', 'center');
      }
    };

    $scope.sendAbsentSMS = function () {
      angular.forEach($scope.subjects, function (subval) {
        if (subval.code === $scope.formData.subject) {
          $scope.subjectName = subval.subject;
        }
      });

      angular.forEach($scope.courses, function (couVal) {
        if (couVal.code === $scope.formData.courseSelect) {
          $scope.courseName = couVal.course;
        }
      });
      var smsParams = {
        CollegeId: $rootScope.userauth.CollegeId,
        BranchId: $rootScope.userauth.BranchId,
        EmpID: $rootScope.userauth.EmpId,
        SubCode: $scope.formData.subject,
        SubName: $scope.subjectName,
        CourseCode: $scope.formData.courseSelect,
        CourseName: $scope.courseName,
        DateAtt: $filter('date')($scope.caldate, 'MM/dd/yyyy'),
        StudentIds: $scope.smsAbs.toString(),
        SMSKey: 'SHLRTechSMS'
      };
      sendSMSStuAtt.post(smsParams, function(response){
        if (response.d !== 'Fail') {
          toast($cordovaToast, 'SMS send successfully', 'long', 'center');
          $state.go('mobix.Dashboard');
        }else{
          toast($cordovaToast, 'SMS send failed', 'long', 'center');
        }
      });
    };
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
