/*!
 * legwork.js version: v1.0.0; author : Wangpq;
 * Date: 2017-07-17T11:30Z
 */


/**
 * 安卓和IOS系统自动执行函数设置外勤地点
 * @method setAddress
 * @param {data} String 返回的字符串
 * @return {Null} 无返回值
 */
function setAddress(data){
    document.getElementById("addRefresh").classList.remove("rotate");
    if(data && data!==""){
        document.getElementById("address").value=data;
    }else{
        toast("获取外勤地点失败啦，您可以点击刷新按钮重新获取，或者手动填写外勤地点")
    }
}

var app={
    init : function(){
        this._init();
        this.render();
        this.controls();
    },
    _init : function(){
        this.dialog=$(".yd-pop-box");
        this.dialogBtn=this.dialog.find(".close");
        this.dialogBd=this.dialog.find('[wp="wpdom"]');
        this.dialogText=this.dialog.find(".text");
    },
    render : function(){
        var self=this;
        self.imgArray=[];
        FastClick.attach(document.body);
        window.setTimeout(function(){
            document.getElementById("addRefresh").click();
        },80)
    },
    controls : function(){
        var self=this;
        // 返回
        document.querySelector("header .back").addEventListener('click', function() {
            self.historyBack();
        }, false);

        // 点击刷新重新获取外勤地点
        document.getElementById("addRefresh").addEventListener('click', function() {
            self.getOutSideAddress();
        }, false);

        // 图片上传文件file
        document.getElementById("file").addEventListener('change', function(evt) {
            self.uploadFileOnChange(evt);
        }, false);

        // 点击完成按钮
        document.getElementById("btnComplate").addEventListener('click', function() {
            self.legwork();
        }, false);

    },
    getOutSideAddress : function(){
        document.getElementById("addRefresh").classList.add("rotate");
        try{
            if(localStorage.platform=="ios"){
                window.WebViewBridge.send("getAddress&setAddress");
            }else{
                window.CloudSign.getAddress();
            }
        }catch(err){
        }
    },
    legwork : function(){
        var self=this;
        var reason=document.getElementById("reason")
          , address= document.getElementById("address")
          , img= document.querySelectorAll(".img-set img")
          , reasonValue=self.trim(reason.value)
          , addressValue=self.trim(address.value);

        if(reasonValue==""){
            toast("外勤事由不能为空!");
            return false;
        }
        if(addressValue==""){
            toast("外勤地点获取失败啦，请重新刷新地址!");
            return false;
        }
        if(img.length<=0) {
            toast("请上传图片!");
            return false;
        }

        var loading=document.getElementById("loading")
          , loadingText=loading.querySelector(".body .text");

        var ajaxData={
            "signType": localStorage.signType,
            "signincode" : localStorage.code ,
            "userphone": localStorage.pbocUserPhone,
            "userid": localStorage.pbocUserId ,
            "outsideaddress": addressValue,
            "reason": reasonValue,
            "imglength": self.imgArray.length,
            "aBase64": self.imgArray[0].base64.substr(23),
            "aBaseFile": self.imgArray[0].origin,
            "base64" :  self.imgArray
        }

        if(self.imgArray.length==2){
            ajaxData.bBase64= self.imgArray[1].base64.substr(23)
        }
        if(self.imgArray.length==3){
            ajaxData.bBase64 = self.imgArray[1].base64.substr(23);
            ajaxData.cBase64 = self.imgArray[2].base64.substr(23) ;
        }
        loading.classList.add("hasText");
        loading.classList.remove("invisibile");
        loadingText.innerHTML='数据正在上传中...';

        new ajax({
            type :"post",
            url : urlConf.outsideSignin,
            data : ajaxData,
            beforeSend : function(data){
            },
            success : function(data){
                if(data && data.status=="0"){
                    loadingText.innerHTML="成功签到！";
                    self.delayTimer(function(){
                        self.historyBack();
                    },1000);
                }else{
                    loadingText.innerHTML="签到失败啦！";
                    self.delayTimer(function(){
                        loading.classList.add("invisibile");
                    },1000);
                }
            },
            error: function(data){
                loadingText.innerHTML="签到失败啦";
                self.delayTimer(function(){
                        loading.classList.add("invisibile");
                },1000);
            },
        })
    },
    delayTimer : function(fn,time){
        window.clearTimeout(timer);
        var timer=window.setTimeout(function(){
            fn();
        },time)
    },
    uploadFileOnChange : function(evt){
        var self=this
          , file=document.getElementById('file')
          , imgfile = file.files[0];

        lrz(imgfile, {
            width: 800
        })
        .then(function (rst) {
            // 预览图片赋值
            var img = new Image();
            img.src = rst.base64;
            img.onload = function () {
                self.doFileOnChange(rst.base64);
                self.imgArray.push(rst);
                if(self.imgArray.length==3){
                    $("#file").attr("disabled","disabled")
                }

                [].forEach.call(document.querySelectorAll(".form li .p img"), function (dom,index) {
                    /*dom.addLongTapEvent(function(){
                        self.deleteSelected(dom.getAttribute("src"));
                    })*/
                   /*  会出错，奇怪
                    dom.addEventListener('click', function() {
                        self.deleteSelected(this);
                    }, true);
                    */
                    dom.onclick=function(){
                        self.deleteSelected(this);
                    }
                });
            };
            return rst;
        })
        .then(function (rst) {
        })
        .catch(function (err) {
            // 万一出错了，这里可以捕捉到错误信息
            // 而且以上的then都不会执行
            toast("对不起，由于兼容性等原因，上传图片出错啦！");
        })
        .always(function () {
            // 不管是成功失败，这里都会执行
        });
    },
    doFileOnChange : function(src){
        var img=document.createElement("img");
        img.src=src;
        document.querySelector(".img-set").appendChild(img);
    },
    deleteSelected : function(dom){
        var self=this;
        if($(dom).hasClass("selected") ){
            dom.classList.remove("selected");
        }else{
            dom.classList.add("selected");
            this.wpDialogConfirm({
                text : "你确定要删除这张图片么",
                okFn : function(){
                    $(dom).remove();
                    self.removeArrayNode(dom.src);
                    self.dialogClose();
                },
                noFn : function(){
                    dom.classList.remove("selected");
                }
            })
        }
    },
    removeArrayNode : function(str){
        var self=this;
        self.imgArray.forEach(function(dom,index){
            if(str==dom.base64){
                self.imgArray.splice(index,1);
            }
        })
    },
    wpDialogConfirm : function(options){
        var self=this;
        options.beforeShowFn && options.beforeShowFn();
        options.text && options.text!=="" ? self.dialogText.html(options.text) : null;
        self.dialog.show();
        self.wpAnimate(self.dialog,"slideInUp");
        self.dialogBtn.unbind("click").bind("click",function(){
             options.afterCloseFn && self.dialogClose(options.afterCloseFn);
        })
        self.dialog.find(".ok").unbind("click").bind("click",function(){
             options.okFn && options.okFn && options.okFn();
        })
        self.dialog.find(".no").unbind("click").bind("click",function(){
             self.dialogClose();
             options.noFn && options.noFn();
        })
        self.dialogBtn.unbind("click").bind("click",function(){
             self.dialogClose();
        })
    },
    dialogClose : function(fn){
        var self=this;
        self.wpAnimate(self.dialog,"slideOutDown",function(){
            self.dialog.hide();
            fn && fn();
        });
    },
    wpAnimate : function(node,name,fn){
        node.addClass('animatedFast '+name).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            node.removeClass('animatedFast '+name);
            fn && fn(node);
        })
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


$(document).ready(function(){
   app.init();
})
