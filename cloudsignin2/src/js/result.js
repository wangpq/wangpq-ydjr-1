/*!
 * result.js version: v1.0.0; author : Wangpq;
 * Date: 2017-07-17T11:30Z
 */

var workStatus = ["","签到正常","缺勤","迟到","早退","请假扣钱","请假不扣钱","外勤打卡"];

/**
 * 用户签到或巡检回调函数
 * @method SigninCallback
 * @param {obj} Object  设备编号
 * @return {Null} 无返回值
 */
function SigninCallback(obj) {
    document.getElementById("loading").classList.add('invisibile');
    if (obj) {
        if ( obj.status == "0"    ) {
            document.getElementById("successSignInTime").innerHTML=obj.time || "";
            document.getElementById("successSignInDevice").innerHTML=localStorage.deviceName || "";
            document.querySelector("#success>.msg>span:nth-child(1)").innerHTML=(obj.signinState && obj.signinState!=="") ? ("您已经" + workStatus[obj.signinState]) :"";
            document.getElementById("success").classList.remove('invisibile');
            document.getElementById("error").classList.add('invisibile');
        } else if ( obj.error && obj.error != "") {
            ForbidSignin(obj.error);
        }
    }
}


/**
 * 用户签到或巡检
 * @method Signin
 * @param {pbocDeviceSn} string  设备编号
 * @return {Null} 无返回值
 */
function Signin(pbocDeviceSn) {
    // toast("你调用了网页的signin方法,传入参数："+pbocDeviceSn);
    // toast("获取设备名："+window.CloudSign.getDeviceName())
    var data = {
        "userid": localStorage.pbocUserId,
        "userphone": localStorage.pbocUserPhone,
        "signincode":localStorage.code,
        "signindevice": pbocDeviceSn,
        "signType": localStorage.signType
    };
    // toast(JSON.stringify(data));
    console.log("用户签到或巡检发送的数据：");
    console.log(data);
    // toast(JSON.stringify(data));
    httpRequest(JSON.stringify(data), urlConf.Signin, SigninCallback, 3);
}


/**
 * 未在设备范围内
 */
function ForbidSignin(msg) {
    document.getElementById("pbocDeviceRights").innerHTML=msg || "";
    document.getElementById("errorSignInTime").innerHTML=new Date().Format("hh:mm");
    document.getElementById("errorSignInName").innerHTML=localStorage.deviceName || "";
    document.querySelector("#error>.msg").innerHTML=msg || "";
    document.getElementById("error").classList.remove('invisibile');
    document.getElementById("success").classList.add('invisibile');
}


/**
 * 日期格式化函数
 * @method Format
 * @param {fmt} String  格式化规则
 * @return {String} 按照格式化规则填充的时间
 */
Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


;(function(){

    Signin(localStorage.pbocDeviceSn);

    document.querySelector("header .back").addEventListener('click', function() {
        var platform = localStorage.platform;
        if (platform == "ios") {
            //window.WebViewBridge.send("closeWebview");
            // 不知道为什么，使用closeWebview在这个页面中不顶用
            window.history.go(-1);
            //window.location.reload();
        }else {
            try{
                window.CloudSign.htmlCallBack();
            }catch(x){
                window.history.back(-1);
            }
        }
    }, false);
})()
