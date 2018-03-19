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
 * index.js
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
    },
    /**
     * 页面初始化
     * @method render
     * @return {Null} 无返回值
     */
    render : function(){
        FastClick.attach(document.body);
        this.initPage();
        pushHistory("bindCard");
    },
    /**
     * 事件控制函数
     * @method controls
     * @return {Null} 无返回值
     */
    controls : function(){
        var self=this; 

        document.querySelector("header a.back").onclick=function(){
            window.location.href=localStorage.indexHref;
        }

        if (window.history && window.history.pushState) {
            window.addEventListener("popstate", function(e) { 
                window.location.href=localStorage.indexHref;
            }, false); 
        }
        
        self.inputsChange();

        $("#btnBind").unbind("click").bind("click",function(){
            var _this=$(this);
            if(!_this.hasClass("disable")){
                self.requestBind();
            }
        })
    },
    requestBind : function(){ 
        var self=this
          , ajaxUrl=""
          , paramType=getUrlParam("type");

        if(paramType=="ghhyk"){
            ajaxUrl=urlconfig.verifyGhkUser;
        }
        if(paramType=="etcyfk"){
            ajaxUrl=urlconfig.verifyEtcUser;
        }

        var ajaxParam={
            "cardNo"  :  $.trim( $("#cardId").val()),  
            "userName" : $.trim( $("#userName").val()),
            "userIdent" : $.trim( $("#idNumber").val()),
            "userId" : localStorage.username
        }
        $.ajax({
            url :  ajaxUrl,
            data : ajaxParam,
            dataType : "JSON",
            type : "get",
            beforeSend : function(){
                showLoading();
            },
            success : function(data){
                hideLoading();
                self.actionBind(data,ajaxParam);
            },
            error : function(){
                hideLoading();
            }
        })
    },
    actionBind : function(data,ajaxParam){
        if(data && data.status=="0"){
            //alert(JSON.stringify(  data  ));

            var res=JSON.parse(data.resData);

            if(res.respCode=="0000"){

                toast("绑定成功");
      
                var paramType=getUrlParam("type");
                if(paramType=="ghhyk"){
                    localStorage.ghkNum=ajaxParam.cardNo;
                }
                if(paramType=="etcyfk"){
                    localStorage.qtkNum=ajaxParam.cardNo;
                }
    
                var timer=window.setTimeout(function(){
                    window.location.href='./detail.html?type='+getUrlParam("type");
                    window.clearTimeout(timer);
                },2000);
            }else{
                toast("对不起，绑定失败");  
            }
        }else{
            //alert(JSON.stringify(  data  ));
            toast("对不起，绑定失败啦");   
        }
    },
    initPage : function(){
        var type=getUrlParam("type");
        if(type=="ghhyk"){
            $("header .hd").text("工会卡绑定");
            $(".yd-bd .desc").html( $("."+type+"-html").html() );
        }else if(type=="etcyfk"){
            $("header .hd").text("云副卡绑定");
            $("#cardId").attr("placeholder","请输入黔通卡号");
            $(".yd-bd .desc").html( $("."+type+"-html").html() );
        }else{ 
        }

        $(".page").addClass("active");
        
        return false;
    },
    inputsChange : function(){
        var self=this
            , userName=$("#userName")
            , idNumber=$("#idNumber")
            , cardId=$("#cardId");   
        cardId.unbind("keyup").bind("keyup",function(){
            self.requestPage();
        })
        userName.unbind("keyup").bind("keyup",function(){ 
            self.requestPage();
        })
        idNumber.unbind("keyup").bind("keyup",function(){
            self.requestPage();
        })
    },
    requestPage : function(){
        var self=this
            , userName=$("#userName")
            , idNumber=$("#idNumber")
            , cardId=$("#cardId")
            , userNameVal=$.trim(userName.val())
            , idNumberVal=$.trim(idNumber.val())
            , cardIdVal=$.trim(cardId.val())
            , btnSubmit=$("#btnBind");

        if(userNameVal=="" || idNumberVal==""  || cardIdVal=="" ){
            btnSubmit.addClass("disable");
            return false;
        }
        
        if(cardIdVal.length<16){
            btnSubmit.addClass("disable");
            return false;
        }

        if( isNaN(cardIdVal) ){
            btnSubmit.addClass("disable");
            //toast("请正确输入卡号");
            return false;  
        }

        if(userNameVal.length<2 ){
            btnSubmit.addClass("disable");
            return false;
        }

        if( !isNaN(userNameVal) ){
            btnSubmit.addClass("disable");
            //toast("请正确输入姓名");
            return false;  
        }

        var idNumFlag=GztUtil.isCardID(idNumberVal);
        if( idNumFlag==true ){
        }else{
            //toast(idNumFlag);
            btnSubmit.addClass("disable");
            return false;
        }

        btnSubmit.removeClass("disable");
    }
 
}


$(function(){
    app.init();
})
