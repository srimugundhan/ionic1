angular.module('mobix')
    .controller('LoginController', function($scope, $rootScope, $state, $ionicLoading, $cordovaToast, Login, StudentDetails) {
        if (window.localStorage.getItem('sauth') === null) {
            $scope.data = {};
            $scope.data = {
                UserName: 'BVVSPSTU1',
                Password: 'bvvs@123'
            };
            $scope.loginSubmit = function($valid, data) {
                if ($valid) {
                    showLoading($ionicLoading);
                    Login.post(data, function(response) {
                        $scope.edata = JSON.parse(response.d);
                        if (angular.isUndefined($scope.edata.user.Invalid)) {
                            storeLocal('sauth', btoa(JSON.stringify($scope.edata.user)));
                            var postParam = {
                                StudentId: $scope.edata.user.studentId,
                                BranchID: $scope.edata.user.branchId,
                                CollegeID: $scope.edata.user.collegeId
                            }
                            StudentDetails.post(postParam, function(resp) {
                                hideLoading($ionicLoading);
                                responseData = resp.d.replace(/(\r\n|\n|\r)/gm, "");
                                responseData = JSON.parse(responseData);
                                storeLocal('userdetails', JSON.stringify(responseData.stuDetails));
                                $state.go('mobix.Dashboard');
                            }, function(error) {
                                hideLoading($ionicLoading);
                                console.log('studentdetails', error);
                            });
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