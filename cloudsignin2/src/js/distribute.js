/**
 * 查询用户信息
 * @method GetUserInfo
 * @param {String} codeInfo 用户手机号
 * @return {Null} 无返回值
 */
function GetUserInfo( codeInfo ) {
    localStorage.code = codeInfo;
    httpRequest("" , urlConf.GetUserInfo + "?Code="+ codeInfo , GetUserInfoCallback , 3);
}

/**
 * 查询用户信息回调函数
 * @method GetUserInfoCallback
 * @param {Object} obj AJAX返回值
 * @return {Null} 无返回值
 */
function GetUserInfoCallback( obj ) {
    // 返回参数：{"status":"1","error":"用户不存在."}
    if( obj.status == "1" ){
        location.href = "./enter.html";
    } else if ( obj.status == "0" ) {
        localStorage.pbocUserName = obj.userInfo.pbocUserName;  // 用户名
        localStorage.pbocUserCmp = obj.userInfo.pbocCmpName; // 公司名称
        localStorage.pbocUserCmpId = obj.userInfo.pbocUserCmpId; // 公司Id
        localStorage.pbocUserId = obj.userInfo.pbocUserId;  // 用户Id
        localStorage.pbocUserPhone = obj.userInfo.pbocUserPhone;  // 用户手机号
        localStorage.pbocUserRight = obj.userInfo.pbocUserRight; // 用户权限
        localStorage.pbocCmpMark = obj.userInfo.pbocCmpMark; // 公司标识
        window.location.href = "./index.html";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    localStorage.platform = getUrlParam('platform');
    localStorage.app = getUrlParam('app');
    if(localStorage.platform !== "ios"){
        try{
            window.gztObj.recoderInterface("h5rights");
        } catch(e){
            return false;
        }
    }
}, false);
