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