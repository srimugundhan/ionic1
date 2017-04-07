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