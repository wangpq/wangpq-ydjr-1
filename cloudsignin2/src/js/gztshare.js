/** 
 * gztshare.js version: v1.0.0; author : Wangpq;
 * Date: 2017-06-08T18:00Z
 * 使用示例：
 * 
 *GztShare._init({
 *   params : [
 *       {
 *           name : "贵州通",
 *           title : "贵州通title",
 *           desc : "贵州通desc",
 *           img : dynsite+'/cloudsignin/images/shareIcon.jpg',
 *           url : "http://www.gztpay.com/"
 *       },
 *       {
 *           name : "云签到",
 *           title : "云签到title",
 *           desc : "云签到desc",
 *           img : dynsite+'/cloudsignin/images/shareIcon.jpg', 
 *           url : window.location.href.replace("myself","enter")
 *       }
 *   ],
 *   selector : ".do .m:first-child .icon",
 *   two : true
 *});
 * 
 * 
 */

/**
 * gztshare.js version: v1.0.0; author : Wangpq;
 * Date: 2017-06-08T18:00Z
 * -----------------------------
 * options 分享插件的配置参数
 * title ： 分享标题
 * desc ： 分享描述内容
 * img ： 分享后展示的图片
 * selector ： 触发分享的对象选择器
 */
var GztShare={
    _init : function(options){
        this.options=options;
        this.render();
        this.controls();
    },
    render : function(){  

        var dom=document.createElement("section");
        dom.classList.add("share-box");

        var tpl='<div class="bg"></div>'; 
        var bodyTpl=
            '<div class="body">'+
                '<div class="hd">分享到</div>'+
                '<ul class="bd">'+
                    '<li>'+
                        '<i class="wx"></i>'+
                        '<span>微信</span>'+
                    '</li>'+
                    '<li>'+
                        '<i class="wx-zone"></i>'+
                        '<span>朋友圈</span>'+
                    '</li>'+
                    '<li>'+
                        '<i class="qq"></i>'+
                        '<span>QQ好友</span>'+
                    '</li>'+
                    '<li>'+
                        '<i class="qq-zone"></i>'+
                        '<span>QQ空间</span>'+
                    '</li>'+
                '</ul>'+
                '<div class="btn-cancel">取消</div>'+
            '</div>';

        
        if(this.options.two){
            var sectionTpl=
                '<div class="section">'+
                    '<div class="hd">分享</div>'+
                    '<ul class="bd">'+
                        '<li>'+
                            '<i class="icon-gzt"></i>'+
                            '<span>'+this.options.params[0].name+'</span>'+
                        '</li>'+
                        '<li>'+
                            '<i class="icon-app"></i>'+
                            '<span>'+this.options.params[1].name+'</span>'+
                        '</li>'+
                    '</ul>'+
                    '<div class="btn-cancel">取消</div>'+
                '</div>';
            tpl+=sectionTpl+bodyTpl;
            dom.innerHTML=tpl;
            dom.querySelector(".section").style.display="block";
            dom.querySelector(".body").style.display="none";  
        }else{
            tpl+=bodyTpl;
            dom.innerHTML=tpl;
            dom.querySelector(".body").style.display="block";  
        }
        
        document.querySelector("body").appendChild(dom);
        this.shareBox=dom;
        this.shareBg=this.shareBox.querySelector(".bg");
        this.shareBtnCancel=this.shareBox.querySelector(".body .btn-cancel");
        if(this.options.two){ 
            this.shareSection=this.shareBox.querySelector(".section");
            this.shareBtnCancelOne=this.shareSection.querySelector(".btn-cancel"); 
        }
        this.shareBody=this.shareBox.querySelector(".body"); 
        this.shareParams={};
        if(!this.options.two){
            var params=this.options.params;
            this.shareParams.url=params[0].url;
            this.shareParams.title=params[0].title;
            this.shareParams.desc=params[0].desc;
            this.shareParams.img=params[0].img;
        }
    },
    /** 
     * 事件控制函数
     * @method controls 
     * @return {Null} 无返回值
     */ 
    controls : function(){
        var self=this;
        // 分享
        if(self.options.selector){
            document.querySelector(self.options.selector).onclick=function(){  
                if(self.options.two){
                    self.shareSection.style.display="block";
                    self.shareBody.style.display="none";  
                }else{
                    self.shareBody.style.display="block";  
                } 
                self.shareTo();
            }
        }else{
            self.shareTo();
        }
    },
    /**
     * 分享到
     */
    shareTo : function(){ 
        var self=this
          , platform=self.core();

        if(platform=="android"){
            self.shareDialog(function(node,index){
                self.shareFn(index);
            }); 
        }else if(platform=="ios"){
            self.shareDialog(function(node,index){
            }); 
        }else{
            self.shareDialog(function(node,index){
                self.shareFn(index);
            }); 
        }
    },
    iosShareFn : function(){ 
        var title=this.shareParams.title
          , desc=this.shareParams.desc
          , linkUrl=this.shareParams.url
          , logoUrl=this.shareParams.img;
        window.WebViewBridge.send("share"+"$$"+title+"$$"+desc+"$$"+linkUrl+"$$"+logoUrl);
    },
    shareFn : function(index){ 
        var n=this.core()
            , urlstr=this.shareParams.url
            , shereType =""
            , title=this.shareParams.title
            , desc=this.shareParams.desc
            , activite=1
            , imageurl=this.shareParams.img;
        switch(index){
            case 0: // 微信
                shereType=3;
                break;
            case 1: // 朋友圈
                shereType=4;
                break;
            case 2: // QQ好友
                shereType=1;
                break;
            case 3: // QQ空间
                shereType=2;
                break;
            default: // 微信
                shereType=3;
        } 
        window.shareInterJs.setShere(urlstr,shereType,title,desc,activite,imageurl);
    },
    /** 
     * 分享到对话框
     * @method shareDialog 
     * @param {fn} Function 点击列表项后执行函数
     * @return {Null} 无返回值
     */ 
    shareDialog : function(fn){  
        var self=this
          , platform=self.core();

        if(platform=="ios"){
            if(self.options.two){
                self.shareBox.style.display="block";
                self.wpAnimate( self.shareBox,"slideInUp");
                if(self.options.two){

                    var hander=function(){
                        self.shareBg.removeEventListener('click', hander, false);
                        self.shareBtnCancelOne.removeEventListener('click', hander, false);   
                        self.wpAnimate(self.shareBox,"slideOutDown",function(){
                            self.shareBox.style.display="none";
                        });
                    }

                    self.shareBg.addEventListener('click', hander, false);
                    self.shareBtnCancelOne.addEventListener('click', hander, false);

                    [].forEach.call(self.shareSection.querySelectorAll(".bd li"), function (dom,index) {
                        dom.onclick=function(){  
                            var params=self.options.params;
                            self.shareParams.url=params[index].url;
                            self.shareParams.title=params[index].title;
                            self.shareParams.desc=params[index].desc;
                            self.shareParams.img=params[index].img;
                            self.shareSection.style.display="none";
                            self.shareBox.style.display="none";
                            self.iosShareFn();
                        }
                    });
                }
            }else{
                self.shareBox.style.display="none";
                self.iosShareFn();
            }
        }else{

            self.shareBox.style.display="block";
            self.wpAnimate( self.shareBox,"slideInUp");

            var hander=function(){
                self.shareBg.removeEventListener('click', hander, false);
                self.shareBtnCancel.removeEventListener('click', hander, false); 
                if(self.options.two){
                    self.shareBtnCancelOne.removeEventListener('click', hander, false); 
                }
                self.wpAnimate(self.shareBox,"slideOutDown",function(){
                    self.shareBox.style.display="none";
                });
            }

            self.shareBg.addEventListener('click', hander, false);
            self.shareBtnCancel.addEventListener('click', hander, false);
            self.shareBtnCancelOne.addEventListener('click', hander, false);

            [].forEach.call(self.shareBody.querySelectorAll(".bd li"), function (dom,index) {
                dom.onclick=function(){
                    self.shareBox.style.display="none";
                    fn && fn(dom,index); 
                }
            });

            if(self.options.two){
                [].forEach.call(self.shareSection.querySelectorAll(".bd li"), function (dom,index) {
                    dom.onclick=function(){   
                        var params=self.options.params;
                        self.shareParams.url=params[index].url;
                        self.shareParams.title=params[index].title;
                        self.shareParams.desc=params[index].desc;
                        self.shareParams.img=params[index].img;
                        self.shareSection.style.display="none";
                        self.shareBody.style.display="block";
                    }
                });
            }
        }
    },
    /**
     * CSS3动画处理函数
     * @method qAnimate
     * @param {dom} Element 要进行动画的Dom对象
     * @param {name} Function CSS3动画名称
     * @param {fn} Function CSS3动画完成后执行函数
     * @return {Null} 无返回值
     */
    wpAnimate : function(dom,name,fn){
        dom.classList.add('animatedFast');
        dom.classList.add(name);
        this.one(dom,this.detectAnimationEndEvents(),function(){
            dom.classList.remove('animatedFast');
            dom.classList.remove(name);
            fn && fn(dom);
        })
    },
    /**
     * 返回支持的animationEnd事件
     * @method detectAnimationEndEvents
     * @return String 返回值
     */
    detectAnimationEndEvents : function(){
        var t;
        var el = document.createElement('wangpq');
        var animEndEventNames = {
            'WebkitAnimation' : 'webkitAnimationEnd',
            'OAnimation' : 'oAnimationEnd',
            'msAnimation' : 'MSAnimationEnd',
            'animation' : 'animationend'
        };
        for(t in animEndEventNames){
            if( el.style[t] !== undefined ){
                return animEndEventNames[t];
            }
        }
    },
    /**
     * 事件绑定只执行一次就自动解除绑定
     */
    one : function(dom, event, callback){
        var handle = function() {
            callback();
            dom.removeEventListener(event, handle);
        }
        dom.addEventListener(event, handle)
    },
    /** 
     * 判断是安卓还是ios内核
     * @method core 
     * @return {String} 返回字符串
     */ 
    core : function(){
        var u = navigator.userAgent;	
        if(u.indexOf('Android') > -1 || u.indexOf('Adr') > -1){
            return 'android';
        }
        else if( !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ){
            return "ios";
        }else{
            return "other";
        }
    }
}


function updateShere(data){  
    if(GztShare.core()=="ios"){
        try{
            window.WebViewBridge.send("closeWebview");
        }catch(x){}
    }else{
        document.querySelector(".share-box").style.display="none";
    }
}
