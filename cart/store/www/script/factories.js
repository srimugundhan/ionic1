angular.module('bookmycart')
    .factory('APIPOST', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url, {}, {
            post: {
                method: 'POST'
            }
        });
    })