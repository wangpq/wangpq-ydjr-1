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
        pushHistory("introduce");
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
    },
    initPage : function(){
        var type=getUrlParam("type");
        document.querySelector("header .hd").innerHTML= type=="ghhyk" ? "工会会员卡" : "云副卡";
        document.querySelector(".introduce .content").innerHTML=document.querySelector('.'+type+"-html").innerHTML; 
    }
}

window.onload=function(){
   app.init();
}
