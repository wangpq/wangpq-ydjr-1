;(function(module,undefined){
var dynsite="http://test.gztpay.com:12111";
//var appserversite='https://appserver.gztpay.com:18443';
// appserver.gztpay.com 修改为：app.gztpay.com 20180101
var appserversite='https://test.gztpay.com:18443';

var authdynsite='https://test.gztpay.com:18443';
//var authdynsite='http://123.126.109.179:38080';

var urlConf = {
    // 实名认证状态接口
    getCreditStatus : authdynsite+'/Authentication/identification/getCreditStatus',
    getCreditDetails : authdynsite+'/Authentication/identification/getCreditDetails',
    // 实名认证查询用户部分信息
    getPartUserInfo : authdynsite+'/Authentication/identification/getPartUserInfo',

    // 发送验证码
    send : appserversite+'/appserver/sms/send',
    // 校验验证码
    codeCheck : appserversite+'/appserver/sms/codeCheck',

    // 本项目接口
    login :  dynsite + '/accumFund/accumFund/login',
    queryUserLoan : dynsite + '/accumFund/accumFund/queryUserLoan',
    queryRepayPlan : dynsite + '/accumFund/accumFund/queryRepayPlan',
    repayLoan : dynsite + '/accumFund/accumFund/repayLoan',
    // 修改重置密码
    changePwd : dynsite + '/accumFund/accumFund/changePwd',
    // 退出登录
    logOut : dynsite + '/accumFund/accumFund/logOut',
    // 查询本金余额、利息、罚息、复利
    queryInterest :  dynsite + '/accumFund/accumFund/queryInterest',
    // 公积金账号是否被暂停提取
    isSuspend :  dynsite + '/accumFund/accumFund/isSuspend'
};
module.dynsite=dynsite;
module.appserversite=appserversite;
module.authdynsite=authdynsite;
module.urlconfig=urlConf;
})(window)
