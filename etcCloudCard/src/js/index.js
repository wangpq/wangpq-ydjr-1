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
        // 贵州通手机号
        localStorage.username=getUrlParam("username");
        localStorage.platform=getUrlParam("platform");
        localStorage.indexHref=window.location.href;
    },
    /**
     * 页面初始化
     * @method render
     * @return {Null} 无返回值
     */
    render : function(){
        FastClick.attach(document.body);
        this.initPage();
        pushHistory("index");
    },
    /**
     * 事件控制函数
     * @method controls
     * @return {Null} 无返回值
     */
    controls : function(){
        var self=this;  
        
        $("header a.back").unbind("click").bind("click",function(){
            historyBack();
        })

        if (window.history && window.history.pushState) {
            window.addEventListener("popstate", function(e) { 
                historyBack();
            }, false); 
        }

        $(".des dl:first-of-type img").unbind("click").bind("click",function(){
            if(localStorage.ghkNum==""){
                window.location.href='./bindCard.html?type=ghhyk';
            }else{
                window.location.href='./detail.html?type=ghhyk';
            }
        })
        
        $(".des dl:last-of-type img").unbind("click").bind("click",function(){
            if(localStorage.qtkNum==""){
                window.location.href='./bindCard.html?type=etcyfk';
            }else{
                window.location.href='./detail.html?type=etcyfk';
            }
        })
    },
    initPage : function(){
        $.ajax({
            url : urlconfig.verifyActivate+"?userId="+getUrlParam("username"),
            type : "get",
            dataType : "JSON",
            beforeSend : function(){
                showLoading();
            },
            success : function(data){ 
                hideLoading();
                $(".page .yd-bd.des").show();
                if(data){
                    localStorage.qtkNum=data.qtcard && data.qtcard.cardNo ? data.qtcard.cardNo : "";
                    localStorage.ghkNum=data.ghcard && data.ghcard.cardNo ? data.ghcard.cardNo : "";
                    $(".des dl:first-of-type dt>.txt").text( GztUtil.formatCardNumSpace(localStorage.ghkNum) );
                    $(".des dl:last-of-type dt>.txt").text( GztUtil.formatCardNumSpace(localStorage.qtkNum) );
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
