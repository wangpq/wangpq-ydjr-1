/*!
 * gztUtil.js version: v1.0.0; author : Wangpq;
 * Date: 2017-09-18T11:00Z
 */

/********** 扩展方法 **********/
var GztUtil={
    ajaxConfig : {
        loadSimpleText :  "<i></i><span>加载中...</span>",
        loadText : "<i></i><span>正在努力加载中...</span>", // 加载提示文本
        ajaxErrorText : "对不起,访问数据出错啦！",
        noAjaxDataText : "暂无交易数据！"
    },
    /**
     * 展示指定的页面
     * @method hidePage
     * @param {id} String 要进入的页面id
     * @return {Null} 无返回值
     */
    showPage : function(id){
        $(".page").removeClass("active")
        document.querySelector("#"+id).classList.add('active');
    },
    showDialog : function(config){  
        var self=this
          , node=document.querySelector('[data-dialog="true"]')
          , body=node.querySelector(".content .body")
          , btnOk=node.querySelector(".btn .ok")
          , btnNo=node.querySelector(".no")
          , btnClose=node.querySelector(".close");
        config.dialog=node;
        config.btnOk=btnOk;
        config.btnNo=btnNo;

        node.className="";
        if(config && config.type=="confirm"){
            node.classList.add("confirm-box");

            var _content='';
            if(config.text && config.text!==""){ 
                _content=config.text;
            }
            var tpl=
            '<dl>'+
                '<dt>提示</dt>'+
                '<dd>'+_content+'</dd>'+
            '</dl>';
            body.innerHTML=tpl;
            var bd=node.querySelector(".bd");

            node.style.display="block";

            config.afterShowFn && config.afterShowFn && config.afterShowFn(config);

            $(node.querySelector(".body dd p.remermber i")).unbind("click").bind("click",function(){
                 var iconNode= $(this);
                 if(iconNode.hasClass("active")){
                     iconNode.removeClass("active");
                     $(node.querySelector(".ok")).addClass("disable");
                 }else{
                     iconNode.addClass("active"); 
                     $(node.querySelector(".ok")).removeClass("disable");

                     config.iconFn && config.iconFn && config.iconFn(config);
                 }
            })  

            $(node.querySelector(".body dd p.remermber span.txt")).unbind("click").bind("click",function(){
      
                 var iconNode= $(this).parent("p.remermber").find("i");
                 if(iconNode.hasClass("active")){
                     iconNode.removeClass("active");
                     $(node.querySelector(".ok")).addClass("disable");
                 }else{
                     iconNode.addClass("active"); 
                     $(node.querySelector(".ok")).removeClass("disable");

                     config.iconFn && config.iconFn && config.iconFn(config);
                 }

            })  

            $(node.querySelector(".ok")).unbind("click").bind("click",function(){
                 config.okFn && config.okFn && config.okFn(config);
            })

            $(node.querySelector(".no")).unbind("click").bind("click",function(){
                self.dialogClose();
                config.noFn && config.noFn(config);
            })


            return false;
        }
        if(config && config.type=="regs"){
            node.classList.add("txt-box");

            var _content='<img src="../images/regularContent.png" alt="">';
            if(config.text && config.text!==""){ 
                _content=config.text;
            }
            var tpl=
            '<dl>'+
                '<dt>使用细则</dt>'+
                '<dd>'+_content+'</dd>'+
            '</dl>';
            body.innerHTML=tpl;
            var bd=node.querySelector(".bd");
            bd.classList.add("resIn");

            node.style.display="block";
            btnClose.addEventListener("click",function(){
                bd.classList.remove("resIn");
                bd.classList.add("resOut");
                var timer=window.setTimeout(function(){
                    node.style.display="none";
                    bd.classList.remove("resOut");
                    window.clearTimeout(timer);
                },480)
            },false)
            return false;
        }
    },
    dialogClose : function(fn){
        document.querySelector('[data-dialog="true"]').style.display="none";
        fn && fn();
    },

    showAlert : function(config){  
        var self=this
          , node=document.querySelector('[data-alert="true"]')
          , body=node.querySelector(".content .body")
          , btnClose=node.querySelector(".close");
        node.className="";

        if(config && config.type=="alert"){
            node.classList.add("txt-box");
            var tpl=
            '<dl>'+
                '<dt>'+(config.title || "标题")+'</dt>'+
                '<dd>'+config.text+'</dd>'+
            '</dl>';
            body.innerHTML=tpl;
            var bd=node.querySelector(".bd");
            bd.classList.add("resIn");

            node.style.display="block";
            btnClose.addEventListener("click",function(){
                bd.classList.remove("resIn");
                bd.classList.add("resOut");
                var timer=window.setTimeout(function(){
                    node.style.display="none";
                    bd.classList.remove("resOut");
                    window.clearTimeout(timer);
                },480)
            },false)
            return false;
        }
    },
    alertClose : function(fn){
        document.querySelector('[data-alert="true"]').style.display="none";
        fn && fn();
    },
    /**
	 * min ≤ r ≤ max
	 */
	randomNumBoth :function (Min,Max){
		var Range = Max - Min;
		var Rand = Math.random();
		var num = Min + Math.round(Rand * Range); //四舍五入
		return num;
	},
    getToday : function(){
        var date=new Date()
          , year=date.getFullYear()
          , month=date.getMonth()+1
          , day =date.getDate()
        month= month<10 ? "0"+String(month) : String(month);
        day= day<10 ? "0"+String(day) : String(day);
        return String(year)+String(month)+String(day);
    },
    // 生成一个唯一的ID
    uuid : function(){
        var d = new Date().getTime();
        var uuid = 'gyxx_xx_4xx_yxx_xx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    },
    tipsFn : function(node,text){
        node.addClass("wploading").html('<div class="text">'+text+'</div>');
    },
    loadingFn : function(node,text){
        node.addClass("wploading").html('<div class="text">'+text+'</div>');
    },
    loadEndFn : function(node){
        node.removeClass("wploading").html("");
    },
    /**
     *替换手机号中间4位数字为*
     */
    formatTelStars : function(tel){
        var reg = /1(\d{2})\d{4}(\d{4})/g;
        return tel.replace(reg,"1$1****$2");
    }
}
