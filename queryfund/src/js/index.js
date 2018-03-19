/*!
 * index.js version: v1.0.0; author : Wangpq;
 * date: 2017-07-28T17:00Z
 * update : 2017-08-24T10:00Z
 */
var app={
    init : function(){
        this._init();
        this.render();
        this.controls();
    },
    _init : function(){
        this.updateSysDate=['20170902','20170903'];
        this.oldMoney=0;
        this.newMoney=0;
        this.addMoney=0;
        this.username=this.getUrlParam("username") || "";
        this.btnRefresh=document.querySelector(".icon-refresh");
        this.dialog=document.querySelector('[data-popbox="true"]');
        this.dialogBtnOk=document.querySelector('[data-popbox="true"] .btn .ok');
        this.dialogBtnNo=document.querySelector('[data-popbox="true"] .btn .no');
    },
    /**
     * 页面初始化
     * @method render
     * @return {Null} 无返回值
     */
    render : function(){
        var self=this;
        FastClick.attach(document.body);
        self.updateSysTips();
    },
    /**
     * 事件控制函数
     * @method controls
     * @return {Null} 无返回值
     */
    controls : function(){
        var self=this;
        // 返回
        [].forEach.call(document.querySelectorAll("header a.back"), function (dom,index) {
            dom.onclick=function(){
                self.historyBack();
            }
        });
        // 刷新
        self.on(self.btnRefresh,"click",function(){
            self.off(this,"click");
            self.renderGjj(1);
        })
        // 查询
        self.on(document.getElementById("btnSearch"),"click",function(){
            self.off(this,"click");
            self.search();
        })
        // 查询
        self.on(document.getElementById("btnArrow"),"click",function(){
            self.off(this,"click");
            self.btnArrowAction(this);
        })
    },
    updateSysTips : function(){
        var self=this
          , dialogAlert=document.getElementById("alert")
          , todayDate=GztUtil.getToday();
        if( todayDate==self.updateSysDate[0] || todayDate==self.updateSysDate[1]  ){
        //if(1==1){   
            dialogAlert.style.display="block";
            document.getElementById("searchPage").style.display="block";
            document.getElementById("searchPage").classList.add("opa");
            dialogAlert.querySelector(".close").addEventListener("click",function(){
                dialogAlert.style.display="none";
            },false)
            return false;
        }else{
            window.setTimeout(function(){
                self.renderGjj(0);
            },80)
        }
    },
    btnArrowAction : function(dom){
        var gjjBoby=document.getElementById("gjjBoby");
        var btnArrow=dom;
        if(gjjBoby.className.indexOf("visible")>0){
            gjjBoby.classList.remove("visible");
            btnArrow.classList.remove("reverse");
        }else{
            gjjBoby.classList.add("visible") ;
            btnArrow.classList.add("reverse");
        }
    },
    renderGjj : function(status){
        var self=this;
        if(status==1){

            var authcode=document.getElementById("authcode");
            var writecode=document.getElementById("writecode");
            writecode.value="";
            self.dialog.style.display="block";
            writecode.focus();

            self.authcode(authcode);

            authcode.onclick=function(){
                self.authcode(authcode);
            }
            self.dialogBtnOk.onclick=function(){
                var writecodeVal=self.trim( writecode.value ).toUpperCase();
                var authcodeVal=authcode.getAttribute("value").toUpperCase();
                if(writecodeVal==""){
                    writecode.focus();
                    return false;
                }
                if(writecodeVal==authcodeVal){
                    self.dialog.style.display="none";
                    self.renderGjjAjax(status);
                }else{
                    writecode.value="";
                    writecode.focus();
                }
            }
            self.dialogBtnNo.onclick=function(){
                self.dialog.style.display="none";
            }
        }else{
            self.renderGjjAjax(status);
        }
    },
    renderGjjAjax : function(status){
        var self=this;
        var ajaxObj={};
        if(status==1){
            ajaxObj.username = self.username;
            ajaxObj.state = status;
            ajaxObj.OpType ="08";
            ajaxObj.LoginLy="02" ;
        }else{
            ajaxObj.username = self.username;
            ajaxObj.state = status;
        }
        self.qAjax({
            url: urlconfig.queryGjjByTel,
            type: 'post',
            data :ajaxObj,
            beforeSend : function(){
                self.btnRefresh.classList.add("rotate");
                if(status==0 ){
                    showLoading()
                }else{
                    document.querySelector(".desc dt .date").innerHTML="数据正在加密传输中...";
                }
            },
            success : function(data){
                if(status==0 ){
                    hideLoading();
                }else{
                    var updateTime=self.getTime();
                    document.querySelector(".desc dt .date").innerHTML="数据已更新完成...";
                    var timer=window.setTimeout(function(){
                        document.querySelector(".desc dt .date").innerHTML=updateTime+"更新";
                        window.clearTimeout(timer);
                    },2000)
                }
                self.btnRefresh.classList.remove("rotate");
                self.renderGjjData(data,status);
            },
            error : function(data){
                hideLoading();
                if(err && err!==""){
                    toast(err);
                }else{
                    toast("对不起，请求出错啦!")
                }
                document.querySelector(".desc dt .date").innerHTML=self.getTime()+"更新";
            }
        })
    },
    renderGjjData : function(data,status){
        if(data && data.name && data.name!==""){
            document.getElementById("resultPage").style.display="block";
            status==0 ? this.oldMoney=data.balance : this.newMoney=data.balance;
            this.addMoney=(parseFloat(this.newMoney)-parseFloat(this.oldMoney)).toFixed(2);
            this.addMoney=this.addMoney>0 ? ("+"+this.addMoney) : "+"+0 ;
            // 账户余额 balance
            document.querySelector("#resultPage header .hd").innerHTML=data.name || "";
            document.querySelector(".desc dt .money").innerHTML=data.balance || "";
            document.querySelector(".desc dt .tips").innerHTML=this.addMoney;
            //document.querySelector(".desc dt .date").innerHTML=this.getTime()+"更新";
            // 月缴纳额
            document.getElementById("monthbalance").innerHTML=data.monthbalance || "";
            // 单位缴存款
            document.getElementById("companybalance").innerHTML=data.companybalance || "";
            // 工资基数
            document.getElementById("wagebase").innerHTML=data.wagebase || "";
            // 公积金号
            document.getElementById("personaccount").innerHTML=data.personaccount  || "";
            // 卡号
            document.getElementById("pan").innerHTML= data.pan || "";
            data.pan=="" ? document.getElementById("pan").parentNode.style.display="none" : "";
            // 身份证号
            document.getElementById("idNum").innerHTML=data.idno!="" ? GztUtil.idReplaceToStars(data.idno) : "";
            // 手机号
            document.getElementById("telphone").innerHTML=data.cellphone || "";
            // 开户日期
            document.getElementById("opentDate").innerHTML=data.openaccountdate || "";
            data.openaccountdate==""? document.getElementById("opentDate").parentNode.style.display="none" : "";
            // 初缴日期
            document.getElementById("startDate").innerHTML=data.startyearofmonth || "";
            data.openaccountdate==""? document.getElementById("startDate").parentNode.style.display="none" : "";
            // 缴至年月
            document.getElementById("lastDate").innerHTML=data.paytoyearofmonth || "";
            // 是否冻结
            document.getElementById("frozen").innerHTML=data.status || "";
            // 是否办理公积金委扣
            document.getElementById("transactentrustcut").innerHTML=data.transactentrustcut || "";
            !data.transactentrustcut? document.getElementById("transactentrustcut").parentNode.style.display="none" : "";
            // 是否办理商代委扣
            document.getElementById("transactbusinesscut").innerHTML=data.transactbusinesscut || "";
            !data.transactbusinesscut? document.getElementById("transactbusinesscut").parentNode.style.display="none" : "";
            // 是否贷款
            document.getElementById("loanflg").innerHTML=data.loanflg || "";
            // 单位经办人
            document.getElementById("operator").innerHTML=data.companytransactperson || "";
            // 单位账号
            document.getElementById("companyaccount").innerHTML=data.companyaccount || "";
            // 单位账户冻结状态
            document.getElementById("zt").innerHTML=data.zt==1? "是" : "否";
            // 所属管理部
            //document.getElementById("orgname").innerHTML=data.orgname || "";
            // 单位法人
            //document.getElementById("snlegalperson").innerHTML=data.snlegalperson || "";
            // 单位销户日期
            document.getElementById("hjspxhrq").innerHTML=data.hjspxhrq || "";
            data.hjspxhrq==""? document.getElementById("hjspxhrq").parentNode.style.display="none" : "";
            // 单位联系电话
            document.getElementById("sntel").innerHTML=data.sntel || "";
            // 单位地址
            document.getElementById("snaddress").innerHTML=data.snaddress || "";
        }else{
            if(status==0){
                 document.getElementById("searchPage").style.display="block";
            }else{
                if(data && data!==""){
                    toast(data);
                }else{
                    toast("获取数据出错啦！");
                }
            }
        }
    },
    search : function(){
        var self=this
          , idno=document.getElementById("idNumber")
          , password= document.getElementById("password")
          , idnoVal=self.trim(idno.value)
          , passwordVal=self.trim(password.value)
          , todayDate=GztUtil.getToday();
        if(todayDate==self.updateSysDate[0] || todayDate==self.updateSysDate[1]){
            return false;
        }

        if(idnoVal==""){
            toast("请输入身份证号");
            return false;
        }
        if(passwordVal==""){
            toast("请输入密码");
            return false;
        }
        if(self.isCardID(idnoVal)!==true){
            toast(self.isCardID(idnoVal));
            return false;
        }
        if(passwordVal.length<6){
            toast("请正确输入您的密码！");
            return false;
        }
        self.qAjax({
            url: urlconfig.queryGjjByIdNum,
            type: 'post',
            data : {
                idno : idnoVal,
                password : passwordVal,
                username : self.username
            },
            beforeSend : function(){
                showLoading();
            },
            success : function(data){
                hideLoading();
                if(data && data.name && data.name!==""){
                    self.renderGjjData(data,1);
                }else{
                    if(data && typeof(data) =="string"){
                        toast(data);
                    }else{
                        toast("请正确输入您的身份证号和密码！");
                    }
                }
            },
            error : function(err){
                hideLoading();
                if(err && err!==""){
                    toast(err);
                }else{
                    toast("对不起，查询出错啦!")
                }
            }
        });
    },
    qAjax : function(options){
        options && options.beforeSend();
        reqwest({
            url: options.url,
            type: 'json',
            method: options.method || "post",
            //contentType: 'application/json',
            crossOrigin: true,
            data:  options.data,
            error: function (err) {
                options.error && options.error(err);
            },
            success: function (res) {
                options.success && options.success(res);
            }
        })
    },
    /**
     * 是否身份证号
     * @method isCardID
     * @return {Boolean || String}
     */
    isCardID : function(sId){
        var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
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
    },
    /**
     * 验证码
     */
    authcode : function(node){
        var code="" ; //在全局定义验证码
        var codeLength = 4;//验证码的长度
        var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',
        'S','T','U','V','W','X','Y','Z');//随机数
        for(var i = 0; i < codeLength; i++) {//循环操作
            var index = Math.floor(Math.random()*36);//取得随机数的索引（0~35）
            code += random[index];//根据索引取得随机数加到code上
        }
        node.innerHTML = code;//把code值赋给验证码
        node.setAttribute("value",code)
    },
    /**
     * 返回并刷新
     * @method historyBack
     * @return {Null} 无返回值
     */
    historyBack : historyBack,
    /**
     * 获取某个地址栏参数
     */
    getUrlParam : getUrlParam,
	on : function(o, ev, fn){
		o.addEventListener?o.addEventListener(ev, fn, false):o.attachEvent('on'+ev, function(){ fn.call(o);});
	},
	off : function(o, ev, fn){
		o.removeEventListener?o.removeEventListener(ev, fn, false):o.detachEvent('on'+ev, fn);
	},
    getTime : function(){
        var date=new Date()
          , year=date.getFullYear()
          , month=date.getMonth()+1
          , day =date.getDate()
          , hour=date.getHours()
          , minute=date.getMinutes();
       day= day<10 ? "0"+String(day) : day;
       month= month<10 ? "0"+String(month) : month;
       hour= hour<10 ? "0"+String(hour) : hour;
       minute= minute<10 ? "0"+String(minute) : minute;
       return year+"-"+month+"-"+day+" "+hour+":"+minute;
    },
    /**
     * 去除左右空白
     * @method trim
     * @return {String} 返回字符串
     */
	trim: function(str) {
		return str.replace(/(^\s*)|(\s*$)/g,'');
	}
}

document.addEventListener("DOMContentLoaded", function() {
    app.init();
}, false);
