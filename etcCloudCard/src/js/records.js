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
    },
    /**
     * 事件控制函数
     * @method controls
     * @return {Null} 无返回值
     */
    controls : function(){
        var self=this;    

        document.querySelector("header a.back").onclick=function(){ 
            window.history.go(-1);
        }

     

    },
    initPage : function(){
        var type=getUrlParam("type");
        $(".article .content .img>img").attr("src",'../images/card_'+type+'.jpg');
        if(type=="ghhyk"){

        }else if(type=="etcyfk"){
             $(".list>li:first-of-type").hide();
        }else{
        }
    }
    
}


$(function(){
    app.init();
})
