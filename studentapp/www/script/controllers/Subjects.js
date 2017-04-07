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