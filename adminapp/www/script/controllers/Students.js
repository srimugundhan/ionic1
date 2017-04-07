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