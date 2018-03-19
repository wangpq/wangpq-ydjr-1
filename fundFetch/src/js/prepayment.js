if(!GztUtil){
    var GztUtil={};
}

/*!
 * prepayment.js
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
        this.initPage();
    },
    /**
     * 事件控制函数
     * @method controls
     * @return {Null} 无返回值
     */
    controls : function(){
        var self=this;
        // 返回
        $("header a.back").unbind("click").bind("click",function(){
            window.history.back();
            //window.location.href='loanInfor.html';
        })

        // 确认提交
        $("#btnSure").unbind("click").bind("click",function(){
            self.btnPrepayment();
        })

        // 单选框切换
        $("#hkType .radio").unbind("click").bind("click",function(){
            self.autoRadioCheck($(this));
        })

        // 确认按钮自动置灰监控
        $("#number").unbind("keyup").bind("keyup",function(){
            self.autoBtnDisable();
        })
        $("#authCode").unbind("keyup").bind("keyup",function(){
            self.autoBtnDisable();
        })

        // 还款方式说明
        $("#paymentState").unbind("click").bind("click",function(){
            self.paymentState();
        })

    },
    initPage : function(){
        var self=this;

        $.ajax({
            type : "post",
            url : urlconfig.queryUserLoan,
            data :{
                // 个人公积金账号
                spCode :  localStorage.psNo,
                // 身份证号
                idNo : localStorage.idNo
            },
            beforeSend : function(){
                showLoading();
            },
            success : function(res){
                hideLoading();
                if(res){
                    self.responseLoadData(res);
                }
            },
            error : function(){
                hideLoading();
                toast("获取公积金贷款信息失败！");
            }
        })

        /*
        var res={
            resultCode : 0,
            resultMsg : "",
            data :[
                {
                    // 借款人姓名
                    spname : "张某某",
                    // 购房地址
                    xxdz : "贵阳市南明区社的士速递收到的多少多少",
                    // 贷款金额
                    jkje : "41022.00",
                    // 贷款年限
                    jkqx : "20",
                    // 借款日期
                    fdrq : "2014-09-18",
                    // 贷款余额
                    bjye : "123251.15",
                    // 还款账号
                    hkzh : "1221001"
                },
                {
                    // 借款人姓名
                    spname : "王某某",
                    // 购房地址
                    xxdz : "贵阳市南明区社的",
                    // 贷款金额
                    jkje : "4022.00",
                    // 贷款年限
                    jkqx : "20",
                    // 借款日期
                    fdrq : "2014-09-18",
                    // 贷款余额
                    bjye : "123251.15",
                    // 还款账号
                    hkzh : "122232001"
                }
            ]
        }
        self.responseLoadData(res);

        */


        /*
         {
            dkzh : "", // 贷款帐号
            bj : "",  // 本金
            lx : "", // 利息
            fx : "",  // 罚息
            fl : ""  // 复利
        }

        var res={
            resultCode : 0,
            resultMsg : "",
            data :{
                dkzh : "122",
                bj : "12",
                lx : "12",
                fx : "33",
                fl : "44"
            }
        }
        */

        $.ajax({
            type : "post",
            url : urlconfig.queryInterest,
            data :{
                // 贷款账号
                dkzh :  getUrlParam("hkzh")
            },
            beforeSend : function(){
                //showLoading();
            },
            success : function(res){
                if(res && res.resultCode==0 && res.data){
                    var data=res.data;
                    var totalHkje=(parseFloat(data.bj) || 0)+(parseFloat(data.lx) || 0)+(parseFloat(data.fx) || 0)+(parseFloat(data.fl) || 0);
                    $(".work dl").attr("data-totalHkje",totalHkje.toFixed(2) );
                    $(".work dl").attr("data-hkjeInfo",JSON.stringify(data));
                    //alert('totalHkje='+totalHkje.toFixed(2));
                    //alert('hkjeInfo='+JSON.stringify(data));
                }
            },
            error : function(){
            }
        })
    },
    paymentState : function(){
        var self=this;
        GztUtil.wpDialogConfirm({
            title : "还款方式说明",
            text : $(".payment-state-html").html(),
            btnOkText : '我知道了',
            beforeShowFn : function(config){
                $(config.btnNo).parent().hide();
            },
            okFn : function(){
                GztUtil.dialogClose();
            }
        })
    },
    autoRadioCheck : function(node){
        var self=this
            , btnSure=$("#btnSure")
            , inputNumber=$("#number")
            // 贷款余额
            , dkyeVal=$("#prevDkye").attr("value").replace(",","")
            // 公积金可用余额
            , usefulBalanceVal=$("#usefulBalance").text()
            // 选中索引值
            , index=node.parent().index()
            // 全部结清金额
            , totalHkje=  $(".work dl").attr("data-totalHkje")
            // 还款信息(本金、利息、罚息、复利)
            , hkjeInfo=$(".work dl").attr("data-hkjeInfo")  ;
        if(index==1){
            // 公积金余额足够全部还款
            //if( parseFloat(dkyeVal)>parseFloat(usefulBalanceVal)){
            if( parseFloat( usefulBalanceVal) >= parseFloat(totalHkje)  ){
                $("#hkType .radio").removeClass("checked");
                node.addClass("checked");
                inputNumber.val( totalHkje );
                btnSure.removeClass("disable");

                HkjeInfo=JSON.parse(hkjeInfo);

                var tpl='<p>全部结清金额为'+totalHkje+'元，详情如下：</p><p>'+
                    '本金:'+(HkjeInfo.bj || 0)+'元<br>'+
                    '利息:'+(HkjeInfo.lx || 0)+'元<br>'+
                    '罚息:'+(HkjeInfo.fx || 0)+'元<br>'+
                    '复利:'+(HkjeInfo.fl || 0)+'元<br>'+
                    '</p>';
                GztUtil.wpDialogConfirm({
                    title : "温馨提醒",
                    text : tpl,
                    btnOkText : '我知道了',
                    beforeShowFn : function(config){
                        $(config.btnNo).parent().hide();
                    },
                    okFn : function(){
                        GztUtil.dialogClose();
                    }
                })
            }
            else{
                GztUtil.wpDialogConfirm({
                    title : "温馨提醒",
                    text : "您的公积金可用余额暂不够全部结清贷款！",
                    btnOkText : '我知道了',
                    beforeShowFn : function(config){
                        $(config.btnNo).parent().hide();
                    },
                    okFn : function(){
                        GztUtil.dialogClose();
                        self.passwordClear();
                    }
                })
            }
        }else{
            alert("hkjeInfo="+hkjeInfo);

            HkjeInfo=JSON.parse(hkjeInfo);
            try{
                alert("yqbj="+HkjeInfo.yqbj);
                alert("yqlx="+HkjeInfo.yqlx);
            }catch(x){}


            // 如果有逾期本金和逾期利息
            if( parseInt(HkjeInfo.yqbj)>0 && parseInt(HkjeInfo.yqlx)>0 ){
                var tpl='<p>您有逾期金额，详情如下：</p><p>'+
                    '逾期本金：'+ HkjeInfo.yqbj +'元<br>'+
                    '逾期利息：'+ HkjeInfo.yqlx +'元<br>'+
                    '</p>';
                GztUtil.wpDialogConfirm({
                    title : "温馨提醒",
                    text : tpl,
                    btnOkText : '我知道了',
                    beforeShowFn : function(config){
                        $(config.btnNo).parent().hide();
                    },
                    okFn : function(){
                        GztUtil.dialogClose();
                    }
                })
            }
            $("#hkType .radio").removeClass("checked");
            node.addClass("checked");
            inputNumber.val("");
            btnSure.addClass("disable");
        }
    },
    responseLoadData : function(res){
        if(res.resultCode==0){
            if(res.data){
                if(res.data.length>0){
                    $(".prepayment").show();

                    var tpl="";
                    res.data.forEach(function(dom,index) {
                        if(dom.hkzh==getUrlParam("hkzh") ){
                            tpl+=
                               '<h2>您的贷款信息如下</h2>'+
                               '<div class="bd">'+
                                '<p>'+
                                    '<span class="name">借款人姓名</span>'+
                                    '<span class="val">'+dom.spname+'</span>'+
                                '</p>'+
                                '<p>'+
                                    '<span class="name">购房地址</span>'+
                                    '<span class="val">'+dom.xxdz+'</span>'+
                                '</p>'+
                                '<p>'+
                                    '<span class="name">贷款金额</span>'+
                                    '<span class="val"><span id="loanMoney">'+dom.jkje+'</span>元</span>'+
                                '</p>'+
                                '<p>'+
                                    '<span class="name">贷款年限</span>'+
                                    '<span class="val">'+dom.jkqx+'年</span>'+
                                '</p>'+
                                '<p>'+
                                    '<span class="name">借款日期</span>'+
                                    '<span class="val">'+dom.fdrq+'</span>'+
                                '</p>'+
                                '<p>'+
                                    '<span class="name">贷款余额</span>'+
                                    '<span class="val" id="prevDkye" value="'+dom.bjye+'">'+dom.bjye+'元</span>'+
                                '</p>'+
                                '</div>';
                        }
                    });
                    $(".prepayment .list-view").html(tpl);

                    $("#allBalance").text(localStorage.balance);
                    // 公积金可用余额=公积金余额-100。若公积金余额低于100元，则公积金可用余额均展示为0元。
                    var usefulBalanceVal=(parseFloat(localStorage.balance)-100).toFixed(2);
                    $("#usefulBalance").text( usefulBalanceVal>0 ? usefulBalanceVal : 0 );

                }
            }
        }else{
            toast("获取公积金贷款信息失败！");
        }
    },
    resureAuthcode : function(){
        var self=this;
        $.ajax({
            type : "post",
            url : urlconfig.codeCheck,
            data : JSON.stringify({
                // 用户手机号
                //cellphone : localStorage.tel || localStorage.gztTel,
                cellphone : $.trim($("#userTell").val()),
                // 短信验证码
                authcode : $.trim($("#authCode").val()),
            }),
            beforeSend : function(){
                showLoading();
            },
            success : function(res){
                hideLoading();
                var res=JSON.parse(res);
                if(res){
                    if(res.ResponseCode=="00"){
                        if(res.state=="1"){
                            toast("请输入正确的验证码！");
                            return false;
                        }
                        if(res.state=="0"){
                            GztUtil.dialogClose();
                            self.requestPreLoanAjax();
                        }
                    }else{
                        toast("确认验证码失败啦！");
                    }
                }
            },
            error : function(){
                hideLoading();
                toast("确认验证码网络出现错误！");
            }
        })
    },
    getAuthcodeDialog : function(){
        var self=this;
        GztUtil.wpDialogConfirm({
            title : "获取验证码",
            text : $(".authcode-html").html(),
            btnOkText : '确定',
            beforeShowFn : function(config){
                config.btnNo.innerHTML="取消";
                $(config.btnNo).parent().show();
            },
            afterShowFn : function(){
                // 获取验证码
                $("#btnAuthCode").unbind("click").bind("click",function(){
                    self.getAuthCode($(this));
                })
            },
            okFn : function(){
                if($.trim($("#authCode").val())==""){
                    toast("请输入验证码！");
                }else{
                    self.resureAuthcode();
                }
            }
        })
    },
    btnPrepayment : function(){
        var self=this,
            btnSure=$("#btnSure"),
            dkye=$.trim( $("#prevDkye").attr("value").replace(",","") ),
            firstRadio=$(".work .tr.m .td:first-of-type .radio"),
            number=$.trim($("#number").val());

        if(btnSure.hasClass("disable")){
            return false;
        }

        if( firstRadio.hasClass("checked") && parseInt( number )<5000 ){
            toast("部分还款最低不能低于5000元！");
        }else if( firstRadio.hasClass("checked") &&  parseInt(dkye)<5000 && parseInt(number)>=5000 ){
            toast('贷款余额低于5000元，您可以选择"全部结清"方式还款！');
        }else{
            // 弹出获取验证码框 (验证码通过才可以提交)
            self.getAuthcodeDialog();
        }

        //self.requestPreLoanAjax();
        /*
        var res={
            resultCode : 0
        }
        if(res.resultCode==0){
            window.location.href='handleResult.html';
        }else{
            toast("提交失败");
        }
        */
    },
    requestPreLoanAjax : function(){
        var self=this
          // 还款金额
          , hkjeVal=$.trim( $("#number").val() )
          // 贷款余额
          , dkyeVal=$.trim( $("#prevDkye").attr("value").replace(",","") );
        $.ajax({
            type : "post",
            url : urlconfig.repayLoan,
            data :{
                // 贷款帐号
                dkzh :  getUrlParam("hkzh"),
                // 调整方式： 02 部分还款，月还款额减少; 01 全部结清
                tzfs :  $(".radio.checked").parent().index()==0 ? "02" : "01",
                // 还款金额
                hkje : hkjeVal,
                // 个人公积金账号
                spCode : localStorage.psNo ,
                // 身份证号
                idNo : localStorage.idNo
            },
            beforeSend : function(){
                showLoading("提前还款信息提交中，请耐心等待!");
            },
            success : function(res){
                if(res){
                    hideLoading();
                    if(res.resultCode==0){
                        // 更新公积金余额(以便返回公积金页面使用这个数据)
                        var fundData=JSON.parse(localStorage.data);
                        var oldBanlance=fundData.data.balance;
                        var newBanlance=(parseFloat(oldBanlance)-parseFloat(hkjeVal)).toFixed(2);
                        if(newBanlance>=0){
                            fundData.data.balance=newBanlance;
                            localStorage.data=JSON.stringify(fundData);
                        }
                        // 跳转到处理结果页
                        window.location.href='handleResult.html?hkje='+hkjeVal+'&dkye='+dkyeVal;
                    }else{
                        //toast(res.resultMsg || "提前还款提交失败");
                        GztUtil.wpDialogConfirm({
                            title : "温馨提醒",
                            text : res.resultMsg || "提前还款提交失败",
                            btnOkText : '我知道了',
                            beforeShowFn : function(config){
                                $(config.btnNo).parent().hide();
                            },
                            okFn : function(){
                                GztUtil.dialogClose();
                            }
                        })
                    }
                }
            },
            error : function(){
                hideLoading();
                toast("提前还款提交失败");
            }
        })

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
        var self=this;
        if(element.hasClass("disable")){
            return false;
        }

        //var telVal=localStorage.tel || localStorage.gztTel ;
        var telVal=$.trim($("#userTell").val());

        self.startTimer(element);

        $.ajax({
            url : urlconfig.send,
            type : "post",
            data : JSON.stringify({
                CellPhone : telVal,
                // 登录名(贵州通登录账号,即贵州通手机号)
                username : localStorage.gztTel,
                imei : localStorage.udid,
                token : localStorage.token
            }),
            contentType:'text/plain;charset:UTF-8',
			dataType:'json',
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
                hideLoading();
                autoLoading("网络出错啦");
            }
        })
    },
    autoBtnDisable : function(){
        var btnSure=$("#btnSure")
          , usefulBalanceVal=$.trim($("#usefulBalance").text())
          , number=$("#number")
          , numberVal=$.trim(number.val());

        if(numberVal==""){
            btnSure.addClass("disable");
        }else{
            btnSure.addClass("disable");
            if(!isNaN(numberVal)){
                if(parseInt(numberVal)<0){
                    toast("输入金额不能有负数!");
                    return false;
                }
                if(parseFloat(numberVal)> parseFloat(usefulBalanceVal) ){
                    toast("输入金额不能高于公积金可用余额!");
                    return false;
                }
                btnSure.removeClass("disable");
            }else{
                btnSure.addClass("disable");
                toast("输入金额必须是数字！");
            }
        }
    }

}

document.addEventListener("DOMContentLoaded", function() {
    app.init();
}, false);
