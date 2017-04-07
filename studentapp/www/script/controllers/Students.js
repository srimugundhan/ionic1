angular.module('mobix')
    .controller('ProfileController', function($scope, $rootScope, $state, $ionicLoading) {
        if (window.localStorage.getItem('sauth') !== null) {
            $scope.profile = JSON.parse(getLocal('userdetails'));
        } else {
            $state.go('Login', {}, {
                reload: true
            });
        }
    })
    .controller('BookTranController', function($scope, $rootScope, $state, $ionicLoading, StudentBookTransactionDetails) {
        if (window.localStorage.getItem('sauth') !== null) {
            var postdata = {
                CollegeID: $rootScope.userauth.collegeId,
                BranchID: $rootScope.userauth.branchId,
                StudentId: $rootScope.userauth.studentId
            };
            showLoading($ionicLoading);
            StudentBookTransactionDetails.post(postdata, function(response) {
                hideLoading($ionicLoading);
                var responseData = response.d;
                responseData = JSON.parse(responseData.replace('},]', '}]'));
                if (Object.keys(responseData.bookTrans).length > 0) {
                    $scope.bookTrans = responseData.bookTrans;
                } else {
                    $scope.bookTrans = [];
                }
            }, function(error) {
                hideLoading($ionicLoading);
                console.log('booktranscont', error);
            });
        } else {
            $state.go('Login', {}, {
                reload: true
            });
        }
    })
    .controller('BookSearchController', function($scope, $rootScope, $state, $ionicLoading, StudentBookSearchDetails) {
        if (window.localStorage.getItem('sauth') !== null) {
            $scope.searchBook = function($valid, data) {
                if ($valid) {
                    var postdata = {
                        CollegeId: $rootScope.userauth.collegeId,
                        BranchId: $rootScope.userauth.branchId,
                        StudentId: $rootScope.userauth.studentId,
                        Book_Name: data.bookname,
                        Author_Name: (data.author === undefined) ? '' : data.author,
                    };
                    showLoading($ionicLoading);
                    StudentBookSearchDetails.post(postdata, function(response) {
                        hideLoading($ionicLoading);
                        var responseData = response.d;
                        responseData = JSON.parse(responseData.replace('},]', '}]'));
                        if (Object.keys(responseData.bookSearch).length > 0) {
                            $scope.bookSearch = responseData.bookSearch;
                        } else {
                            $scope.bookSearch = [];
                        }
                    }, function(error) {
                        hideLoading($ionicLoading);
                        console.log('bookSearch', error);
                    });
                }
            }
        } else {
            $state.go('Login', {}, {
                reload: true
            });
        }
    })
    .controller('WalletController', function($scope, $rootScope, $state, $filter, $ionicLoading, StudentWalletBalance, getWalletMenu, insertStudentBalance, $cordovaToast) {
        if (window.localStorage.getItem('sauth') !== null) {
            $scope.init = function() {
                showLoading($ionicLoading);
                var postdata = {
                    CollegeID: $rootScope.userauth.collegeId,
                    BranchID: $rootScope.userauth.branchId,
                    StudentId: $rootScope.userauth.studentId,
                };
                StudentWalletBalance.post(postdata, function(response) {
                    hideLoading($ionicLoading);
                    var responseData = response.d;
                    responseData = JSON.parse(responseData.replace('},]', '}]'));
                    if (Object.keys(responseData.walletamount).length > 0) {
                        $scope.availBal = responseData.walletamount[0]['balance'];
                    } else {
                        $scope.availBal = 0;
                    }
                }, function(error) {
                    hideLoading($ionicLoading);
                    console.log('StudentWalletBalance', error);
                });
            };
            $scope.init();
            getWalletMenu.post({
                CollegeID: $rootScope.userauth.collegeId,
                BranchID: $rootScope.userauth.branchId
            }, function(response) {
                hideLoading($ionicLoading);
                var responseData = response.d;
                responseData = JSON.parse(responseData.replace('},]', '}]'));
                if (Object.keys(responseData.walletmenu).length > 0) {
                    $scope.walletmenus = responseData.walletmenu;
                } else {
                    $scope.walletmenus = [];
                }
            }, function(error) {
                hideLoading($ionicLoading);
                console.log('StudentWalletBalance', error);
            });
            $scope.is_showbtn = true;
            $scope.amountpay = function(choseVal) {
                $scope.is_showbtn = false;
                $scope.menu = choseVal;
            };
            $scope.cacelpay = function() {
                $scope.menu = {};
                $scope.is_showbtn = true;
            };
            $scope.walletsubmit = function($valid, data) {
                if ($valid) {
                    $scope.balanceAmt = (parseInt($scope.availBal) - parseInt(data.amount) >= 0) ? parseInt($scope.availBal) - parseInt(data.amount) : -1;
                    if ($scope.balanceAmt >= 0) {
                        showLoading($ionicLoading);
                        var storeddata = {
                            CollegeID: $rootScope.userauth.collegeId,
                            BranchID: $rootScope.userauth.branchId,
                            StudentId: $rootScope.userauth.studentId,
                            TransID: Math.floor(1000000000 + Math.random() * 9000000000),
                            TransDateTime: $filter('date')(new Date(), 'MM/dd/yyyy HH:mm'),
                            Purpose: data.purpose,
                            AmtPaid: data.amount,
                            ToAccountID: $scope.menu.AccountID,
                            Balance: $scope.balanceAmt,
                            Key: 'SHLRWallet2017'
                        };

                        insertStudentBalance.post(storeddata, function(response) {
                            hideLoading($ionicLoading);
                            console.log(response);
                            if (response.d !== 'Fail') {
                                toast($cordovaToast, 'Successfully amount paid', 'long', 'bottom');
                                $scope.cacelpay();
                                $scope.init();
                            } else {
                                toast($cordovaToast, 'Amount paied failed', 'long', 'bottom');
                            }
                        }, function(error) {
                            hideLoading($ionicLoading);
                            console.log('insertStudentBalance', error);
                        });
                    } else {
                        toast($cordovaToast, 'Wallet amount is low', 'long', 'bottom');
                    }
                    //$scope.init();
                }
            };
        } else {
            $state.go('Login', {}, {
                reload: true
            });
        }
    })