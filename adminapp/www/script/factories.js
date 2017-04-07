"use strict";
angular.module('mobix')
    .factory('Login', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'Login', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('LeaveGroup', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetEmpLeaveGroup', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('Incharges', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getInchargeStaffNames', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('LeaveTypes', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getleavenames', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('LeaveAvail', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getInitialLeaves', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('ApplyLeave', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'SaveLeaveApply', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetStudents', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetStudents', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetLeaveStatusMaster', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetLeaveStatusMaster', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('Getappliedleave', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'Getappliedleave', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetSubjects', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetSubjects', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetClassHandlings', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetClassHandlings', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetLeavedetails', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetLeavedetails', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetCourses', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetCourses', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('SaveLeaveApproval', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'SaveLeaveApproval', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('leaveApproval', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'leaveApproval', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('leaveapprovalrejection', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'leaveapprovalrejection', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('leaverecommendation', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'leaverecommendation', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('SaveLeaveRecommend', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'SaveLeaveRecommend', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('leaverecommendrejection', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'leaverecommendrejection', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('staffinchargeleaveapproval', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'staffinchargeleaveapproval', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('savestaffICleave', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'savestaffICleave', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('savestaffICleaverejection', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'savestaffICleaverejection', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('getTimeTable', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getTimeTable', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('getstudentcountcoursewise', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getstudentcountcoursewise', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetEvents', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetEvents', {}, {
            post: {
                method: 'POST'
            }
        });
    }).factory('GetCoursesAdmin', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetCoursesAdmin', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('UpdateDevice', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'pushnotifyupdate', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('GetSemister', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetSemister', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('GetMessageTemplate', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetMessageTemplate', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('GetSMSTemplate', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetSMSTemplate', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('sendBulkSMSNew', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'sendBulkSMSNew', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('getStudentsAll', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getStudentsAll', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('getEmpData', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getEmpData', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('GetDepartments', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetDepartments', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('getJobTitle', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getJobTitle', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('getStudentWSec', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getStudentWSec', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('Getsections', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'Getsections', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('SaveStuAttendanceApp', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'SaveStuAttendanceApp', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('GetEmpCourseSubjects', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'GetEmpCourseSubjects', {}, {
            post: {
                method: 'POST'
            }
        });
    })
    .factory('getstudentattstatus', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'getstudentattstatus', {}, {
            post: {
                method: 'POST'
            }
        });
    })
   .factory('sendSMSStuAtt', function($resource, URLCONFIG) {
        return $resource(URLCONFIG.api_url + 'sendSMSStuAtt', {}, {
            post: {
                method: 'POST'
            }
        });
    })     