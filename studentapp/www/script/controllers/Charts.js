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