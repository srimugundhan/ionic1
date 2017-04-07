/**
 * @ngdoc constant
 * @name mobix.constant
 * @description
 * APP Constant
 */
angular.module('mobix')
    .constant('URLCONFIG', {
        api_url: 'http://125.99.253.22/services/attendanceservice.asmx/'
    })
    .constant('USERAVATAR', {
        image64: 'http://placehold.it/64x64',
        image300: 'http://placehold.it/300x300'
    })
    .constant('NOIMG', {
        image500: 'http://placehold.it/500x450'
    })
    .constant('IMGURL', {
        /* profileimg: "http://digitalmis.in/Upload/EmpPhotos/",
         collogo: "http://digitalmis.in/Upload/EmpPhotos/"*/
        profileimg: "http://125.99.253.22/Upload/EmpPhotos/",
        collogo: "http://125.99.253.22/Upload/EmpPhotos/"
    })