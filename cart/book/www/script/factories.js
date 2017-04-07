angular.module('bookmycart')
    .factory('Login', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'users/login', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('Register', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'users/register', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('Profile', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'users/profile?access_token=' + getLocal('accesstoken'), {}, {
            post: {
                method: 'POST'
            },
            get: {
                method: 'GET'
            }
        });
    }).factory('Forgot', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'users/forgot', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('ChangePwd', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'users/change_password?access_token=' + getLocal('accesstoken'), {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('Categories', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'categories/main', {}, {
            get: {
                method: 'GET'
            }
        });
    }).factory('SubCategories', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'categories/sub/:id', {}, {
            get: {
                method: 'GET'
            }
        });
    }).factory('DeviceUpdate', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'device_update', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('FBME', function($resource, URLCONFIG) {
        return $resource('https://graph.facebook.com/v2.8/me?fields=id,name,email&access_token=' + getLocal('fbtoken'), {}, {
            get: {
                method: 'GET'
            }
        });
    })