/*!
 * myFund.js
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

        // 退出
        $("header a.back").unbind("click").bind("click",function(){
            self.appExit();
        })

        // 修改密码
        $("header .txt").unbind("click").bind("click",function(){
            self.resetPassword();
        })
        
        // 使用公积金还款(公积金提取)
        $("#btnFetch").unbind("click").bind("click",function(){ 
            self.fundFetch();
        })

        // 查看公积金贷款
        $("#btnLook").unbind("click").bind("click",function(){ 
            window.location.href="loanInfor.html?source=look";
        })

        // 点击这里(公积金账号异常提示框)
        $(".warm-tips p b").unbind("click").bind("click",function(){
            self.fundExceptionTips();
        })

        // 箭头
        $("#btnArrow").unbind("click").bind("click",function(){
            self.btnArrowClick();
        })
    },
    fundExceptionTips : function(){
        GztUtil.wpDialogConfirm({
            title : "温馨提醒",
            text : '<div style="text-indent:2em;text-align:left;">若发现账号信息异常，需要停用还款功能，请持本人身份证原件到市住房公积金中心申请办理。</div>',
            btnOkText : '我知道了',
            beforeShowFn : function(config){
                config.btnNo.parentNode.style.display="none";
            },
            okFn : function(){
                GztUtil.dialogClose();
            }
        })
    },
    appExit : function(){
        /*
        localStorage.psNo="";
        localStorage.balance="";
        localStorage.tel="";
        localStorage.data="";
        localStorage.pin="";
        */
        $.ajax({
            type : "post",
            url : urlconfig.logOut,
            beforeSend : function(){
            },
            success : function(res){
                if(res && res.resultCode==0){
                    window.location.href=localStorage.indexHref;
                }else{
                    window.location.href=localStorage.indexHref;
                }
            },
            error : function(err){
                window.location.href=localStorage.indexHref;
            }
        })
    },
    initPage :function(){
        this.renderGjjData(JSON.parse(localStorage.data));
    },
    renderGjjData : function(res){
        var self=this;
        if(res.resultCode==0 && res.data){
            var data=res.data;
            self.username=data.name;
            self.personaccount=data.personAccount;
            // 个人公积金账号
            localStorage.psNo=data.personAccount;
            // 个人公积金余额
            localStorage.balance=data.balance;
            // 姓名
            document.querySelector("header .hd").innerHTML=data.name || "我的公积金";
            // 账户余额 balance
            document.querySelector(".desc dt .money").innerHTML=data.balance || "---";
            // 月缴额
            document.getElementById("monthbalance").innerHTML=data.monthBalance || "---";
            // 单位月缴额
            document.getElementById("companybalance").innerHTML=data.companyBalance || "---";
            // 职工月缴额
            document.getElementById("employeebalance").innerHTML=(parseInt(data.monthBalance)-parseInt(data.companyBalance)) || "---";
            // 工资基数
            document.getElementById("wagebase").innerHTML=data.wageBase || "---";
            // 公积金号
            document.getElementById("personaccount").innerHTML=data.personAccount  || "---";
            // 卡号
            document.getElementById("pan").innerHTML= data.pan || "---";
            data.pan == "" ? document.getElementById("pan").parentNode.style.display = "none": "";
            // 身份证号
            document.getElementById("idNum").innerHTML= data.idNo || "---";
            // 手机号
            document.getElementById("telphone").innerHTML=data.cellPhone || "---";
            // 开户日期
            document.getElementById("opentDate").innerHTML=data.openAccountDate || "---";
            data.openAccountDate == "" ? document.getElementById("opentDate").parentNode.style.display = "none": "";
            // 初缴日期
            document.getElementById("startDate").innerHTML=data.startYearOfMonth || "---";
            data.startYearOfMonth == "" ? document.getElementById("startDate").parentNode.style.display = "none": "";
            // 缴至年月
            document.getElementById("lastDate").innerHTML=data.payToYearOfMonth || "---";
            // 单位汇缴状态
            document.getElementById("frozen").innerHTML= self.changeStatusText(data.status) || "---";
            // 是否办理公积金委扣
            document.getElementById("transactentrustcut").innerHTML=data.gjjwk || "---";
            !!data.gjjwk? document.getElementById("transactentrustcut").parentNode.style.display = "none": "";
            // 是否办理商代委扣
            document.getElementById("transactbusinesscut").innerHTML=data.transactBusinessCut || "---";
            !!data.transactBusinessCut? document.getElementById("transactbusinesscut").parentNode.style.display = "none": "";
            // 是否贷款
            document.getElementById("loanflg").innerHTML=data.loanFlg || "---";
            // 单位经办人
            document.getElementById("operator").innerHTML=data.companyTransactPerson || "---";
            // 单位账号
            document.getElementById("companyaccount").innerHTML=data.companyAccount || "---";
            document.getElementById("zt").innerHTML = data.zt == "1" ? "是": "否";
            document.getElementById("hjspxhrq").innerHTML = data.hjspxhrq || "---";
            data.hjspxhrq == "" ? document.getElementById("hjspxhrq").parentNode.style.display = "none": "---";
            document.getElementById("sntel").innerHTML = data.sntel || "---";
            document.getElementById("snaddress").innerHTML = data.snaddress || "---";
        }else{
            toast("获取用户公积金信息失败！");
        }
    },
    resetPassword : function(){
        window.location.href="modifyPass.html";
    },
    btnArrowClick : function(){
        var gjjBoby=document.getElementById("gjjBoby"),
            gjjBobySecondChild=gjjBoby.querySelector(".mm:last-of-type"),
            btnArrow=document.getElementById("btnArrow");
        if(gjjBobySecondChild.className.indexOf("visible")>0){
            gjjBobySecondChild.classList.remove("visible");
            btnArrow.classList.remove("reverse");
        }else{
            gjjBobySecondChild.classList.add("visible") ;
            btnArrow.classList.add("reverse");
        }
    },
    responseLoadData : function(res){
        var self=this
          , spcode=res.resultCode;
        // 未修改过初始密码
        if(spcode=="-2"){
             // 弹出框提示
             GztUtil.wpDialogConfirm({
                title : "温馨提醒",
                text : '若要使用公积金还款，须先修改初始密码',
                btnOkText : '修改密码',
                btnNoText : "先不修改",
                beforeShowFn : function(){
                },
                okFn : function(){
                   window.location.href="modifyPass.html";
                }
            })
        }
        // 接口数据返回成功(已经修改过初始密码)
        else if(spcode=="0"){
             // 弹出框提示
             var htmlStr=
                '<div class="radio checked">'+
                    '<i class="checked"></i><span>提前偿还住房公积金贷款</span>'+
                '</div>';
            GztUtil.wpDialogConfirm({
                title : "请选择还款类型",
                text : htmlStr,
                btnNoText : "取消",
                btnOkText : '确认',
                beforeShowFn : function(config){
                    //config.btnNo.parentNode.style.display="none";
                    //config.btnOk.parentNode.classList.add("disable");
                },
                afterShowFn : function(config){
                    /*
                    $(config.dialogText.querySelector(".radio") ).unbind("click").bind("click",function(){
                        var node=$(this);
                        if(node.hasClass("checked")){
                            node.removeClass("checked");
                            config.btnOk.parentNode.classList.add("disable");

                        }else{
                            node.addClass("checked");
                            config.btnOk.parentNode.classList.remove("disable");
                        }
                    })*/
                },
                okFn : function(config){
                    if(config.btnOk.parentNode.className.indexOf("disable")>-1){
                        return false;
                    }else{
                        window.location.href="loanInfor.html?source=use";
                    }
                }
            })
        }
        // 接口数据返回失败
        else{
        }
    },
    fundFetch : function(){
        var self=this;
        // 实名认证身份证姓名和公积金账户姓名是否相同
        /*
        if(localStorage.name!==self.username){
            toast("该身份证号与其他职工重复，系统无法受理，请到住房公积金中心柜台办理相关业务!");
            return false;
        }
        */

        // 确认公积金账号信息是否异常
        $.ajax({
            type : "post",
            url : urlconfig.isSuspend,
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
                    //alert('确认公积金账号信息是否异常resultCode='+res.resultCode)
                    // 未暂停
                    if(res.resultCode==0){
                        self.requestLoadData();
                    }
                    // 请求参数有误
                    else if(res.resultCode==-1){
                        GztUtil.wpDialogConfirm({
                            title : "温馨提醒",
                            text : '<div style="text-indent:2em;text-align:left;">查询公积金账号是否异常的参数有误!</div>',
                            btnOkText : '我知道了',
                            beforeShowFn : function(config){
                                config.btnNo.parentNode.style.display="none";
                            },
                            okFn : function(){
                                GztUtil.dialogClose();
                            }
                        })  
                    }
                    // 已暂停
                    else if(res.resultCode==-2){
                        GztUtil.wpDialogConfirm({
                            title : "温馨提醒",
                            text : '<div style="text-indent:2em;text-align:left;">您的账号信息异常，还款功能暂时停用，若需重新启用，请联系公积金中心申请办理。</div>',
                            btnOkText : '我知道了',
                            beforeShowFn : function(config){
                                config.btnNo.parentNode.style.display="none";
                            },
                            okFn : function(){
                                GztUtil.dialogClose();
                            }
                        })   
                    }
                    // 未登录
                    else if(res.resultCode==-99){
                        toast("请先登录！");
                    }else{    
                    }
                }else{
                    //toast("查询公积金账号信息异常与否出错啦");

                }
            },
            error : function(){
                hideLoading();
                toast("查询公积金账号信息异常与否失败");
            }
        })
    },
    requestLoadData : function(){
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
                }else{
                    toast("未获取到数据接口信息");
                }
            },
            error : function(){
                hideLoading();
                toast("请求数据接口信息失败");
            }
        })
    },
    changeStatusText : function(status){
        var x="";
        switch (status){
        case "00":
            x= "待审批";
            break;
        case "01":
            x="职工开户";
            break;
        case "11":
            x="正常汇缴";
            break;
        case "1B":
            x="缓缴";
            break;
        case "21":
            x="封存";
            break;
        case "2A":
            x="停缴";
            break;
        case "2B":
            x="待处理";
            break;
        case "31":
            x="销户";
            break;
        case "32":
            x="销户";
            break;
        case "33":
            x="销户";
            break;
        case "34":
            x="销户";
            break;
        default:
            x="销户";
        }
        return x;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    app.init();
}, false);
