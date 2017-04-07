angular.module('bookmycart')
    .directive('categoryPoduct', function() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'templates/product_category.html',
            scope: {
                category: '@',
                cateogryname: '@',
                categoryid: '@'
            },
            controller: function($scope, $rootScope, $state, $ionicLoading, $timeout, APIPOST) {
                showLoading($ionicLoading);
                $scope.products = [];
                $scope.is_have_products = false;
                $timeout(function() {
                    APIPOST.post({ type: 'productsList', category_id: $scope.category }, function(response) {
                        hideLoading($ionicLoading);
                        if (response.success === 'true') {
                            $scope.products = response.data;
                        }
                    }, function(error) {
                        hideLoading($ionicLoading);
                    });
                }, 500)
            }
        }
    })
    .filter('capitalize', function() {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });