angular.module('mobix')
    .factory('Login', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'Login', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('StudentDetails', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'StudentDetails', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('StudentBookSearchDetails', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'StudentBookSearchDetails', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('StudentAttendanceDetails', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'StudentAttendanceDetails', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('StudentFeesDetails', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'StudentFeesDetails', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('StudentMarkDetails', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'StudentMarkDetails', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('insertDownloadDetail', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'insertDownloadDetail', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetTimeTable', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetTimeTable', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('BrowerDetails', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'BrowerDetails', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('StudentBookTransactionDetails', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'StudentBookTransactionDetails', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('StudentWalletBalance', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'StudentWalletBalance', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('getWalletMenu', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getWalletMenu', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('insertStudentBalance', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'insertStudentBalance', {}, {
            post: {
                method: 'POST'
            }
        });
    })