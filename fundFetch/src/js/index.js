if(!GztUtil){
    GztUtil={};
}

/**
 * 返回并刷新
 * @method historyBack
 * @return {Null} 无返回值
 */
function historyBack(){
	var platform = getUrlParam("platform");
	if (platform == "ios") {
		try{
			window.WebViewBridge.send("closeWebview");
		}catch(e){
			window.webkit && window.webkit.messageHandlers.closeWebview.postMessage(null);
		}
	}else if(platform == 'android'){
		var isLocation = getUrlParam('isLocation');
		if(isLocation == 'yes'){
			window.history.back();
		}else{
			window.gztObj.finishPage();
		}
	}else{
    }
}

/**
 * 展示指定的页面
 * @method showMyPage
 * @param {id} String 要进入的页面id
 * @return {Null} 无返回值
 */
GztUtil.showMyPage=function(id){
    $(".page").removeClass("active");
    document.querySelector("#"+id).classList.add('active');
}

function statementPageControls(){
    var btnSure=$("#btnResure");
    // 点击 选择框
    $(".personal-box .agreement>i").unbind("click").bind("click",function(){
        var self=$(this);
        if(self.hasClass("checked")){
            self.removeClass("checked");
            btnSure.addClass("disable");
            localStorage.agreeStatement="false";
        }else{
            self.addClass("checked");
            btnSure.removeClass("disable");
            localStorage.agreeStatement="true";
        }
    }) 
    $(".personal-box .agreement>.txt").unbind("click").bind("click",function(){
        var self=$(this),
            checkBox=self.siblings("i");
        if(checkBox.hasClass("checked")){
            checkBox.removeClass("checked");
            btnSure.addClass("disable");
            localStorage.agreeStatement="false";
        }else{
            checkBox.addClass("checked");
            btnSure.removeClass("disable");
            localStorage.agreeStatement="true";
        }
    })

    // 确认按钮
    btnSure.unbind("click").bind("click",function(){
        if(!btnSure.hasClass("disable")){
            GztUtil.showMyPage("loginPage");   
        }
    })
    // 退出
    $("#statementPage header a.back").unbind("click").bind("click",function(){
        historyBack();
    })
}
/**
 * 实名认证成功后执行函数
 */
function afterRzSuccessFn(){
    GztUtil.showMyPage("statementPage");
    statementPageControls();
}

/**
 * 实名验证成功后IOS和安卓自动调用的方法，提供给前端的参数包含姓名、身份证号、手机号
 * 成功时: 参数是"&&"+"1"+"&&"+userid+"&&"+realname+"&&"+idcardno,
 * 失败时: 参数是"&&"+"0",
 * 取消时：参数是"&&"+"-1",
 * 其中userid是贵州通账号，也就是手机号, realname是身份证名称,idcardno是身份证号
 * @param {String} info
 * @return {NUll} 无返回值
 */
function advanRealNameCheckResult(info){
    //alert("advanRealNameCheckResult="+info);
    if(info && info!==""){
        var tempArr = info.split("&&");
        var flagVue=tempArr[0];

        if(flagVue=="1"){
            //alert("advanRealNameCheckResult--1-[0]-"+tempArr[0]);
            //alert("advanRealNameCheckResult--1-gztTel-"+tempArr[1]);
            //alert("advanRealNameCheckResult--1-name-"+tempArr[2]);
            //alert("advanRealNameCheckResult--1-idNo-"+tempArr[3]);

            localStorage.gztTel = tempArr[1];
            localStorage.name = tempArr[2];
            localStorage.idNo = tempArr[3];
            hideLoading();
            app.renderPageData();
            // 实名认证成功
            afterRzSuccessFn();
        }else if(flagVue=="0"){
            //alert("advanRealNameCheckResult--info--"+info);
            hideLoading();

            GztUtil.showMyPage("rzPage");
        }else if(flagVue=="-1"){
            historyBack();
        }else{
        }
    }
}


/*!
 * login.js
 * version: v1.0.0; author : Wangpq;
 */
var app={
    init : function(){
        this._init();
        this.render();
        this.controls();
    },
    _init : function(){
        var self=this;

        // 贵州通手机号
        var _username=getUrlParam("username");

        localStorage.indexHref=window.location.href;
        localStorage.username=_username;
        localStorage.gztTel=_username;

        localStorage.udid=getUrlParam("udid");
        localStorage.token=getUrlParam("Gtoken");

        self.userName=$("#userName");
        self.idNumber=$("#idNumber");
        self.userPass=$("#userPass");
        self.btnLogin=$("#btnLogin");

        // 自动判断是否调用调用实名认证
        self.autoRequestIdentification();

        /*
        hideLoading();
        localStorage.name = "尹二男";
        localStorage.idNo = "520102197401042458";
        self.renderPageData();
        GztUtil.showMyPage("loginPage");
        */
    },
    /**
     * 页面初始化
     * @method render
     * @return {Null} 无返回值
     */
    render : function(){
        FastClick.attach(document.body);
        this.requestLoginPage();
    },
    /**
     * 事件控制函数
     * @method controls
     * @return {Null} 无返回值
     */
    controls : function(){
        var self=this;

        // 退出
        $("#rzPage header a.back").unbind("click").bind("click",function(){
            historyBack();
        })

        // 退出
        $("#loginPage header a.back").unbind("click").bind("click",function(){
            historyBack();
        })

        // 点击 选择框
        $(".login-box .agreement>i").unbind("click").bind("click",function(){
            $(this).toggleClass("checked");
            self.requestLoginPage();
        })
        $(".login-box .agreement>.txt").unbind("click").bind("click",function(){
            var checkBox=$(this).siblings("i");
            checkBox.toggleClass("checked");
            self.requestLoginPage();
        })

        // 点击 登录
        self.btnLogin.unbind("click").bind("click",function(){
            self.loginControl();
        })

        // 点击 重新认证
        $("#btnReAuth").unbind("click").bind("click",function(){
            // 重新打开加载框
            showLoading();
            // 调用实名认证
            self.gztCertification();
        })

        // 点击 暂不认证
        $("#btnNoAuth").unbind("click").bind("click",function(){
            // 退出应用
            historyBack();
        })

        // 监测输入框是否为空和checkbox是否选中
        self.inputsChange();
    },
    autoRequestIdentification : function(){
        var self=this;
        $.ajax({
            type : "post",
            url : urlconfig.getCreditDetails,
            data : JSON.stringify({
                userId :  localStorage.gztTel
            }),
            contentType:'text/plain;charset:UTF-8',
            dataType:'json',
            beforeSend : function(){
                showLoading();
            },
            success : function(res){  
                hideLoading();
                if(res){
                    if(res.respResult== '0'){
                        if(res.info && res.info.length>0){
                            // 人脸识别位状态
                            var flag=res.info.substr(2,1);
                            // 未认证
                            if(flag==0){
                                window.setTimeout(function(){
                                    self.gztCertification();
                                },480);
                            }
                            // 1: 已认证
                            else if(flag==1){
                                self.getAuthUserInfo();
                            }else{ 
                            }
                        }
                    }else if(res.respResult== '1'){
                        hideLoading();
                        toast(res.respMsg || "请求用户实名认证状态失败啦"); 
                    } else{
                        toast(res.respMsg || "请求用户实名认证状态失败");
                    }
                }else{
                    toast("请求用户实名认证状态接口无数据返回");
                }
            },
            error : function(err){
                hideLoading();
                toast("请求用户实名认证状态失败");
            }
        })
    },
    getAuthUserInfo : function(){
        var self=this;
        $.ajax({
            type : "post",
            url : urlconfig.getPartUserInfo,
            data : JSON.stringify({
                userId :  localStorage.gztTel
            }),
            contentType:'text/plain;charset:UTF-8',
			dataType:'json',
            beforeSend : function(){
                showLoading();
            },
            success : function(res){
                hideLoading();
                if(res){
                    if(res.respResult=="0"){
                        if(res.info && res.info.userInfo && res.info.userInfo.username){
                            localStorage.gztTel = res.info.userInfo.username;
                            localStorage.name = res.info.userInfo.realAuthName;
                            localStorage.idNo = res.info.userInfo.idCardNo;
                            hideLoading();
                            self.renderPageData();

                            if(localStorage.agreeStatement && localStorage.agreeStatement=="true" ){
                                GztUtil.showMyPage("loginPage"); 
                            }else{
                                GztUtil.showMyPage("statementPage");  
                                statementPageControls();  
                            }
                        }
                    }else{
                        toast(res.respMsg || "查询用户实名认证信息失败");
                    }
                }else{
                    toast("查询用户实名认证信息接口无数据返回");
                }
            },
            error : function(err){
                hideLoading();
                toast("查询用户实名认证信息失败");
            }
        })
    },
    gztCertification : function(){

        var platform = getUrlParam('platform');
        localStorage.platform = platform;

        if(platform == "ios"){
            window.WebViewBridge.send("needAdvanRealNameCheck&&1");
        }else{
            window.gztObj.needAdvanRealNameCheck("1");
        }
    },
    renderPageData : function(){
        $("#userName").val(localStorage.name);
        $("#idNumber").val(localStorage.idNo);
    },
    inputsChange : function(){
        var self=this;

        self.userName.unbind("keyup").bind("keyup",function(){
            self.requestLoginPage();
        })
        self.idNumber.unbind("keyup").bind("keyup",function(){
            self.requestLoginPage();
        })
        self.userPass.unbind("keyup").bind("keyup",function(){
            self.requestLoginPage();
        })
    },
    requestLoginPage : function(){
        var self=this
        , nameVal=$.trim(self.userName.val())
        , idNumberVal=$.trim(self.idNumber.val())
        , userPassVal=$.trim(self.userPass.val())
        , agreeCheckBox=$(".login-box .agreement>i");

        if(nameVal=="" || idNumberVal=="" || userPassVal=="" || !agreeCheckBox.hasClass("checked")){
            self.btnLogin.addClass("disable");
            return false;
        }
        self.btnLogin.removeClass("disable");
    },
    loginControl : function(){
        var self=this
        , nameVal=$.trim(self.userName.val())
        , idNumberVal=$.trim(self.idNumber.val())
        , userPassVal=$.trim(self.userPass.val());

        if(self.btnLogin.hasClass("disable")){
            return false;
        }

        /**************************************************************************
         * 验证身份证号格式是否正确 (姓名和身份证由实名认证后获取，所以不用前端再验证啦)
         **************************************************************************/

        $.ajax({
            type : "post",
            url : urlconfig.login,
            data :{
                idNo :  idNumberVal,
                pin :  userPassVal,
                loginLy : "08"
            },
            beforeSend : function(){
                showLoading();
            },
            success : function(res){
                hideLoading();
                if(res){
                    var userInfo={
                        name : nameVal,
                        idNo : idNumberVal
                    }
                    self.responseLoginData(res,userInfo);
                }else{
                    toast("很遗憾，登录失败了");
                }
            },
            error : function(err){
                hideLoading();
                toast("很遗憾，登录失败了哦");
            }
        })
    },
    responseLoginData : function(res,user){
        var self=this;
        if(res.resultCode==0){
            /**
             * name,idNo可以删除,实名认证成功后其实已经赋值过啦
             */
            // 个人姓名
            localStorage.name = user.name;
            // 个人身份证号
            localStorage.idNo = user.idNo;

            // 个人公积金账号
            localStorage.psNo = res.data.PersonAccount;
            // 个人公积金账号预留手机号
            localStorage.tel =res.data.cellPhone ;
            // 查询到的公积金信息(用于myFund.html的数据展示)
            localStorage.data = JSON.stringify(res);
            window.location.href="myFund.html";
        }else{
            GztUtil.wpDialogConfirm({
                title : "温馨提醒",
                text : res.resultMsg,
                btnOkText : '我知道了',
                okFn : function(){
                    GztUtil.dialogClose();
                    self.clearPassword();
                }
            })
        }
    },
    clearPassword : function(){
        this.userPass.val("")
    }
}


$(function(){
    app.init();
})
