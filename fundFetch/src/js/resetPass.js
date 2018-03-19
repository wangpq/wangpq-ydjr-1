if(!GztUtil){
    var GztUtil={};
}

/**
 * 身份证号码验证
 * @method isCardID
 * @param {sId} String 要验证的字符串
 * @return {String || Boolean} 无返回值
 */
GztUtil.isCardID=function(sId){
    var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
    var iSum=0 ;
    var info="" ;
    if(!/^\d{17}(\d|x)$/i.test(sId))
        return "你输入的身份证长度或格式错误";
    sId=sId.replace(/x$/i,"a");
    if(aCity[parseInt(sId.substr(0,2))]==null) 
        return "你的身份证地区非法";
    sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
    var d=new Date(sBirthday.replace(/-/g,"/")) ;
    if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))
        return "身份证上的出生日期非法";
    for(var i = 17;i>=0;i --) 
        iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
    if(iSum%11!=1) 
        return "你输入的身份证号非法";
    return true;
}

/*!
 * resetPass.js 
 * version: v1.0.0; author : Wangpq;
 */
var app={
    init : function(){
        this._init();
        this.render();
        this.controls();
    },
    _init : function(){
    },
    /**
     * 页面初始化
     * @method render
     * @return {Null} 无返回值
     */
    render : function(){
        FastClick.attach(document.body);
        this.requestPage();
    },
    /**
     * 事件控制函数
     * @method controls
     * @return {Null} 无返回值
     */
    controls : function(){
        var self=this;
        // 返回
        $("#resetPage header a.back").unbind("click").bind("click",function(){
            window.location.href=localStorage.indexHref;
        })

        // 提交
        $("#btnSubmit").unbind("click").bind("click",function(){
            self.resetPassControl();
        })
        
        // 获取验证码
        $("#btnGetAuthcode").unbind("click").bind("click",function(){
            self.getAuthCode($(this));
        })
        
        // 必填项有一项为空时，提交按钮置灰
        self.inputsChange();
    },
    startTimer : function(element){
        var self=this;
        self.getAuthCodeNum=60;
        self.getAuthCodeTimer=window.setInterval(function(){
            --self.getAuthCodeNum;
            if(self.getAuthCodeNum==0){
                self.endTimer(element);
                return false;
            }
            element.text("已发送("+self.getAuthCodeNum+")秒");
        },1000)
    },
    endTimer : function(element){
        window.clearInterval(this.getAuthCodeTimer);
        element.removeClass("disable").text("获取验证码");
    },
    getAuthCode : function(element){

        //alert("localStorage.token:"+localStorage.token);
        
        var self=this;
        if(element.hasClass("disable")){
            return false;
        }

        var telVal=$.trim($("#telphone").val()) ;
        self.startTimer(element);

        $.ajax({
            url : urlconfig.send,
            type : "post",
            data : JSON.stringify({
                // 手机号
                CellPhone : telVal,
                // 登录名(贵州通登录账号,即贵州通手机号)
                username : localStorage.gztTel,
                imei : localStorage.udid,
                token : localStorage.token
            }),
            beforeSend : function(){
                 showLoading("正在获取验证码");
                 element.addClass("disable");
            },
            success : function(data){
                hideLoading();
                var data=JSON.parse(data);
                // ResponseCode : 00->成功,01->失败 ,02->重新登录 ,01->登录 
                if(data && data.ResponseCode=="00"){
                }else{
                    if(data && data.ResponseCode=="01" && data.ResponseDesc!==""){
                        self.endTimer(element);
                        autoLoading(data.ResponseDesc);
                    }else if(data && (data.ResponseCode=="02" || data.ResponseCode=="04")  ){
                        toast("登录贵州通才能获取到验证码哦！");
                    }
                }
            },
            error : function(data){  
                self.endTimer(element);
                autoLoading("网络出错啦");
            }
        })
    },
    inputsChange : function(){
        var self=this
        , accountName=$("#accountName")
        , userName=$("#userName")
        , accountNum=$("#accountNum")
        , idNumber=$("#idNumber")
        , telphone=$("#telphone")
        , authcode=$("#authcode")
        , companyAccountNum=$("#companyAccountNum")
        , companyOperator=$("#companyOperator")
        , companyLegalPerson=$("#companyLegalPerson");

        accountName.unbind("keyup").bind("keyup",function(){ 
            self.requestPage();
        })
        userName.unbind("keyup").bind("keyup",function(){
            self.requestPage();
        })
        accountNum.unbind("keyup").bind("keyup",function(){
            self.requestPage();
        })
        idNumber.unbind("keyup").bind("keyup",function(){ 
            self.requestPage();
        })
        telphone.unbind("keyup").bind("keyup",function(){ 
            self.requestPage();
        })
        authcode.unbind("keyup").bind("keyup",function(){ 
            self.requestPage();
        })
    },
    requestPage : function(){  
        var self=this
        , accountName=$("#accountName")
        , userName=$("#userName")
        , accountNum=$("#accountNum")
        , idNumber=$("#idNumber")
        , telphone=$("#telphone")
        , authcode=$("#authcode")
        , companyAccountNum=$("#companyAccountNum")
        , companyOperator=$("#companyOperator")
        , companyLegalPerson=$("#companyLegalPerson")

        , accountNameVal=$.trim(accountName.val())
        , userNameVal=$.trim(userName.val())
        , accountNumVal=$.trim(accountNum.val())
        , idNumberVal=$.trim(idNumber.val())
        , telphoneVal=$.trim(telphone.val())
        , authcodeVal=$.trim(authcode.val())
        , companyAccountNum=$.trim(companyAccountNum.val())
        , companyOperator=$.trim(companyOperator.val())
        , companyLegalPerson=$.trim(companyLegalPerson.val())
        
        , btnSubmit=$("#btnSubmit");

        if(accountNameVal=="" || userNameVal==""  || accountNumVal=="" || idNumberVal==""  || telphoneVal=="" || authcodeVal==""){
            btnSubmit.addClass("disable");
            return false;
        }
        btnSubmit.removeClass("disable");
    },
    requestSubmitAjax : function(ajaxData){
        var self=this;
        $.ajax({
            type : "post",
            url : urlconfig.changePwd,
            data : {
                // 操作标识： 0 修改密码 1重置密码
                flag : "1",
                // 个人公积金账号(必填)
                spCode : ajaxData.spCode,
                // 单位公积金账号
                companyAccount : ajaxData.companyAccount,
                // 单位公积金账户名称(必填)
                snName : ajaxData.snName,
                // 姓名 (必填)
                name  : ajaxData.name,
                // 身份证号码 (必填)
                idNo : ajaxData.idNo,
                // 公积金单位经办人
                companyTransactPerson : ajaxData.companyTransactPerson,
                // 公积金单位法人
                snlegalperson : ajaxData.snlegalperson
            },
            beforeSend : function(){
                showLoading();
            },
            success : function(res){
                hideLoading();
                if(res){
                    self.responseResetPassData(res);
                }else{
                    toast("密码重置接口数据返回失败啦！"); 
                }
            },
            error : function(){
                hideLoading();
                toast("密码重置失败啦！");
            }
        })

        /*
        var res={
            resultCode : 0,
            resultMsg :""
        }
        self.responseResetPassData(res);
        */
    },
    resureAuthcode : function(ajaxData){
        var self=this;
        $.ajax({
            type : "post",
            url : urlconfig.codeCheck,
            data :JSON.stringify({
                // 用户手机号
                cellphone : $.trim($("#telphone").val()),
                // 短信验证码
                authcode : $.trim($("#authcode").val())
            }),
            beforeSend : function(){
                showLoading();
            },
            success : function(res){
                var res=JSON.parse(res);
                hideLoading();
                if(res){
                    if(res.ResponseCode=="00"){
                        if(res.state=="1"){
                            toast("请输入正确的验证码！"); 
                            return false;
                        }
                        if(res.state=="0"){
                            self.requestSubmitAjax(ajaxData);
                        }
                    }else{
                        toast("确认验证码失败啦！"); 
                    }
                }else{
                    toast("确认验证码数据接口出错啦！");  
                }
            },
            error : function(){
                hideLoading();
                toast("确认验证码网络出现错误！");
            }
        })
    },
    resetPassControl : function(){  
        var self=this
        , accountName=$("#accountName")
        , userName=$("#userName")
        , accountNum=$("#accountNum")
        , idNumber=$("#idNumber")
        , telphone=$("#telphone")
        , authcode=$("#authcode")
        , companyAccountNum=$("#companyAccountNum")
        , companyOperator=$("#companyOperator")
        , companyLegalPerson=$("#companyLegalPerson")

        , accountNameVal=$.trim(accountName.val())
        , userNameVal=$.trim(userName.val())
        , accountNumVal=$.trim(accountNum.val())
        , idNumberVal=$.trim(idNumber.val())
        , telphoneVal=$.trim(telphone.val())
        , authcodeVal=$.trim(authcode.val())
        , companyAccountNumVal=$.trim(companyAccountNum.val())
        , companyOperatorVal=$.trim(companyOperator.val())
        , companyLegalPersonVal=$.trim(companyLegalPerson.val())

        , btnSubmit=$("#btnSubmit")
        
        if(btnSubmit.hasClass("disable")){
            return false;
        }

        if(!isNaN(accountNameVal) || accountNameVal.length<4){
            toast("请正确输入您的单位公积金账户名称");
            return false;
        }

        if(!isNaN(userNameVal)){
            toast("请正确输入您的姓名");
            return false;
        }else{
            if(userNameVal.length<2){
                toast("请正确输入您的姓名");
                return false; 
            }
        }      

        if(!isNaN(accountNumVal)){
            //alert("是数字");
        }else{
            toast("请正确输入您的个人公积金账号");
            return false;
        }

        /** 验证身份证号格式是否正确 */
        var idNumFlag=GztUtil.isCardID(idNumberVal);
        if(idNumFlag==true){
        }else{
            toast(idNumFlag);
            return false;
        }

        if(!isNaN(telphoneVal)){
        }else{
            toast("请正确输入您的手机号码");
            return false;
        }

        if(!isNaN(authcodeVal)){
        }else{
            toast("请正确输入验证码");
            return false;
        }
        
        // 重置密码的AJAX接口参数数据
        var ajaxData={
            // 个人公积金账号(必填)
            spCode : accountNumVal,
            // 单位公积金账号
            companyAccount : companyAccountNumVal,
            // 单位公积金账户名称(必填)
            snName : accountNameVal,
            // 姓名 (必填)
            name  : userNameVal,
            // 身份证号码 (必填)
            idNo : idNumberVal,
            // 公积金单位经办人
            companyTransactPerson : companyOperatorVal,
            // 公积金单位法人
            snlegalperson : companyLegalPersonVal
        }

        // 调用确认验证码正确与否的接口
        this.resureAuthcode(ajaxData);
    },
    responseResetPassData : function(res){
        if(res.resultCode==0){
            toast("密码重置成功");
            var timer=window.setTimeout(function(){
                window.clearTimeout(timer);
                window.location.href=localStorage.indexHref;
            },2000) 
        }else if(res.resultCode==-1){
            toast(res.resultMsg || "信息有误，请重新输入"); 
        }else{
            toast("信息有误，请重新输入"); 
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    app.init();
}, false);
