/**
 * @ngdoc constant
 * @name bookmycart.constant
 * @description
 * APP Constant
 */
angular.module('bookmycart')
    .constant('URLCONFIG', {
        api_url: 'http://xtore.in/api/apis.php'
    })
    .constant('USERAVATAR', {
        image64: 'http://placehold.it/64x64',
        image300: 'http://placehold.it/300x300'
    })
    .constant('NOIMG', {
        image500: 'http://placehold.it/500x450'
    })
    .constant('SOCIAL_APP', {
        Facebook: {
            APPID: '749685551855047', 
            SECRET: 'bdfc94645ad0370d445519abd0ccadec',
            SCOPE: 'public_profile,email',
            REDIRECT: 'http://localhost',
        },
        Twitter: {
            APIKEY: '9J0LincJqA4xdQId9BzWJczgF',
            SECRET: 'MEuCxjDRYCu8c8zXW092I0CM7FesDAN8ZVd5gch4AQynuSVvib'
        },
        Google: {
            CLIENTID: '166112933021-urekcf866bt4uvbc0vpgr5pmjcrb9kg9.apps.googleusercontent.com',
            SECRET: '-7nMnBJUKU6loUF2V4r-O3Du',
            SCOPE: 'https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile',
            REDIRECT: 'http://localhost',
        }
    })