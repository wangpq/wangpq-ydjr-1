if(!GztUtil){
    GztUtil={};
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
        pushHistory("detail");
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

        document.querySelector(".list>li.online").onclick=function(){
            var type=getUrlParam("type");
            window.location.href="./recharge.html?type="+type;
        }
    },
    initPage : function(){
        var self=this
          , type=getUrlParam("type");
        $(".article .content .img>img").attr("src",'../images/card_'+type+'.png');
        if(type=="ghhyk"){
            $("header .hd").text("工会会员卡");
            $(".article .content .img>.txt").text(  GztUtil.formatCardNumSpace( localStorage.ghkNum) );
        }
        if(type=="etcyfk"){
            $("header .hd").text("ETC云副卡"); 
            $(".article .content .img>.txt").text( GztUtil.formatCardNumSpace(localStorage.qtkNum) );
        }
        // 请求余额
        self.requestBalance(); 
    },
    requestBalance : function(){
        var self=this
          , cardType=""
          , cardNo=""
          , type=getUrlParam("type");

        if(type=="ghhyk"){
            cardType="ghk";
            cardNo=localStorage.ghkNum;
        }
        if(type=="etcyfk"){
            cardType="qtk";
            cardNo=localStorage.qtkNum;
        }

        $.ajax({
            url :  urlconfig.queryBalance,
            data : {
                "cardNo"  :  cardNo,  
                "cardType" : cardType
            },
            dataType : "JSON",
            type : "get",
            beforeSend : function(){
                showLoading();
            },
            success : function(data){
                hideLoading();
                $(".page .yd-bd.article").show();
                if(data && data.resData){
                    var res=JSON.parse(data.resData);
                    if(res.respCode && res.respCode=="0000"){
                        $("#banance").text(res.balance);
                    }
                }else{
                    $("#banance").text("0.00"); 
                }   
            },
            error : function(){
                hideLoading();
            }
        }) 
    }
    
}


$(function(){
    app.init();
})
