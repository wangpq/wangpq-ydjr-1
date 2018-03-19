;(function(module,undefined){
var dynsite = "https://www.gztpay.com:65006";
//var dynsite = "http://cloudsignin.gztpay.com:31211";// 访问云签到生产后台
//var dynsite = "http://test.gztpay.com:31211"; // 访问云签到测试后台
//var dynsite ="http://192.168.1.130:7001";
var urlConf = {
    GetUserInfo : dynsite + "/CloudSignin2/AppService/GetUserInfo",
    ActviateUser : dynsite + "/CloudSignin2/AppService/ActviateUser",
    ActviateUserEx : dynsite + "/CloudSignin2/AppService/ActviateUserEx",
    // 用户签到或巡检
    Signin : dynsite + "/CloudSignin2/AppService/Signin" ,
    // 用户签到记录
    GetSigninRecord : dynsite + "/CloudSignin2/AppService/getSigninRecord",
    // 获取用户指定时间段内的签到记录
    GetAllRecords : dynsite + "/CloudSignin2/AppService/getSigninRecord",
    // 用户巡检记录
    GetInspectionRecords : dynsite + "/CloudSignin2/AppService/GetInspectionRecords",
    // 用户申诉
    SignInAppeal : dynsite + "/CloudSignin2/AppService/SignInAppeal",
    // 管理员查询签到记录
    CheckSignInRecords : dynsite + "/CloudSignin2/AppService/CheckSignInRecords",
    // 根据用户id查询改用户公司所有部门
    GetDps : dynsite + "/CloudSignin2/AppService/GetDps",
    // 查询设备名称
    Device : dynsite + "/CloudSignin2/AppService/Device",
    // 通讯录查询
    addressList : dynsite+"/CloudSignin2/AppService/getAddressBook",
    // 外勤签到
    outsideSignin : dynsite+"/CloudSignin2/AppService/outsideSignin",
    // 公司开通云签到
    openApplication : dynsite+"/CloudSignin2/AppService/OpenApplication",
    // 查询员工每日需签到次数
    signinTimesByDay : dynsite+"/CloudSignin2/AppService/signinTimesByDay",
    // 根据用户id查询该用户公司所有巡检点
    getDevs :  dynsite+"/CloudSignin2/AppService/GetDevs",
    // 获取外勤签到信息
    getOutside : dynsite+"/CloudSignin2/AppService/getOutsideImg",
    // 查询巡检
    findArrange : dynsite+"/CloudSignin2/AppService/findArrange"
};

module.dynsite=dynsite;
module.urlConf=urlConf;

})(window)
