/*!
 * enter.js version: v1.0.0; author : Wangpq;
 * Date: 2017-07-17T11:30Z
 */
var app={
    init : function(){
        this.render();
        this.controls();
    },
    render : function(){
        FastClick.attach(document.body);
        this.gztPopBox=document.getElementById("ydPopBox");
        this.swiper();
    },
    controls : function(){
        var self=this;

        document.querySelector("header .back").addEventListener('click', function() {
            self.historyBack();
        }, false);
        
        document.querySelector(".btn-box .btn.btn-success").addEventListener('click', function() {
            self.actviateUser();
        }, false);
    },
    swiper : function(){
        var elem=document.querySelector(".swipe")
          , aNums = elem.querySelectorAll(".num-box span")
          , sliderLength=elem.querySelectorAll(".swipe-wrap > div").length;
        var mySwipe = new Swipe(elem,{
            auto: 5000,
            continuous: true,
            stopPropagation:true,
            callback: function(index,element) {  
                if(aNums){
                    var i = aNums.length;
                    while (i--) {
                        aNums[i].className = '';
                    }
                    aNums[index].className = 'current'; 
                }
            },
            transitionEnd: function(index, element) {}
        })
        for(var i=0;i<aNums.length;i++){
            aNums[i].index=i; 
            aNums[i].onclick=function(){
                mySwipe.slide(this.index, 350)
            }
        }
    },
    actviateUser : function(){
        var self=app;
        var data = {
            "pbocUserName": self.trim( document.querySelector("input[name='name']").value ),
            "pbocUserPhone":self.trim( document.querySelector("input[name='tel']").value ),
            "pbocUserCode":localStorage.code 
        };
        if ( null == data.pbocUserName || "" == data.pbocUserName) {
            toast('姓名不能为空！!', 3000);
        } else if (data.pbocUserName.indexOf(" ") >= 0) {
            toast('姓名不能为空格！!', 3000);
        } else if (!data.pbocUserName.match(/^(?!_)(?!.*?_$)[\w\u4E00-\u9FA5\uF900-\uFA2D]{2,15}$/)) {
            toast('请输入2到15个字的姓名,不能以下划线开头和结尾!', 3000);
        } else if ( null == data.pbocUserPhone || data.pbocUserPhone == "") {
            toast('请输入手机号码!', 3000);      
        } else if (!data.pbocUserPhone.match(/(^1[3|4|5|7|8]\d{9}$)/)) {
            toast('请输入正确的手机号码!', 3000);
        } else {
            document.getElementById("loading").classList.remove("invisibile");
            httpRequest(JSON.stringify(data) , urlConf.ActviateUser , self.actviateUserCallback, 3); 
       }
    },
    /**
     * 用户激活回调函数
     */
    actviateUserCallback : function(obj){   
        var self=app;
        if( (obj.status == "1" || obj.status == "4" ) && obj.error && obj.error != "" ){
            document.getElementById("loading").classList.add("invisibile");
            toast( obj.error  );
        } else if ( obj.status == "0" ) {
            httpRequest("" , urlConf.GetUserInfo + "?Code="+ localStorage.code , self.getUserInfoCallback , 3);
        } else if ( obj.status == "3" ) {
            // 是否重新激活
            self.gztPopBox.style.display="block";

            self.gztPopBox.querySelector(".content .text").innerHTMl=obj.error;
            
            // 是
            self.gztPopBox.querySelector(".btn .ok").onclick=function(){
                self.gztPopBox.style.display="none";
                self.ActviateUserEx();
                document.getElementById("loading").classList.add("invisibile");
            }

            // 否
            self.gztPopBox.querySelector(".btn .no").onclick=function(){
                self.gztPopBox.style.display="none";
                document.getElementById("loading").classList.add("invisibile");
            }
        }
    },
    ActviateUserEx : function(){
        var self=app;
        var data = {
            "pbocUserName": self.trim( document.querySelector("input[name='name']").value ),
            "pbocUserPhone": self.trim( document.querySelector("input[name='tel']").value ),
            "pbocUserCode":localStorage.code // ？？这里要填写手机码
        };
        if ( null == data.pbocUserName || "" == data.pbocUserName) {
            toast('姓名不能为空！!', 3000);
        } else if (data.pbocUserName.indexOf(" ") >= 0) {
            toast('姓名不能为空格！!', 3000);
        } else if (!data.pbocUserName.match(/^[\u4E00-\u9FA5]{2,15}$/)) {
            toast('请输入2到15个字的中文姓名!', 3000);
        } else if ( null == data.pbocUserPhone || data.pbocUserPhone == "") {
            toast('请输入手机号码!', 3000);      
        } else if (!data.pbocUserPhone.match(/(^1[3|4|5|7|8]\d{9}$)/)) {
            toast('请输入正确的手机号码!', 3000);
        } else {
            document.getElementById("loading").classList.remove("invisibile");
            httpRequest(JSON.stringify(data) , urlConf.ActviateUserEx , self.actviateUserCallback , 3); 
        }
    },
    getUserInfoCallback : function(obj){
        document.getElementById("loading").classList.add("invisibile");
        if( obj.status == "1" ){ 
            toast(obj.error);
        } else if ( obj.status == "0" ) {
            localStorage.pbocUserName = obj.userInfo.pbocUserName;  // 用户名
            localStorage.pbocUserCmp = obj.userInfo.pbocCmpName; // 公司名称
            localStorage.pbocUserCmpId = obj.userInfo.pbocUserCmpId; // 公司Id
            localStorage.pbocUserId = obj.userInfo.pbocUserId;  // 用户手机号
            localStorage.pbocUserPhone = obj.userInfo.pbocUserPhone;  // 用户手机号
            localStorage.pbocUserRight = obj.userInfo.pbocUserRight; // 用户权限
            localStorage.pbocUserCmpDpName =obj.userInfo.pbocUserCmpDpName; //部门名称
            localStorage.pbocCmpMark =obj.userInfo.pbocCmpMark //公司标识
            window.location.href = "./index.html"
        }
    },
    /**
     * 去除左右空白
     * @method trim
     * @return {String} 返回字符串
     */
    trim : function(str){
        return str.replace(/(^\s*)|(\s*$)/g,'');
    },
    /**
     * 返回并刷新
     * @method historyBack
     * @return {Null} 无返回值
     */
    historyBack : historyBack
}


document.addEventListener("DOMContentLoaded", function() {
    app.init();
}, false);


