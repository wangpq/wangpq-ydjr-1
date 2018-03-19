/*!
 * contracts.js version: v1.0.0; author : Wangpq;
 * Date: 2017-07-17T11:30Z
 */
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
        FastClick.attach(document.body);
        this.initHeadBack();
        // 重置分页请求参数
        this.initRequest();
        // 请求渲染公司所有通讯录
        this.getAllLists();
        // 请求渲染部门
        this.renderDeparts();
    },
    controls : function(){
        var self=this;

        // 返回按钮
        document.querySelector("header .back").addEventListener('click', function() {
            self.historyBack();
        }, false);
        
        // 部门筛选
        document.getElementById("btn-filter").addEventListener('click', function() { 
            self.departmentFilter();
        }, false);

        document.querySelector(".btn-search").addEventListener('click', function() {  
            self.initRequest();
            self.searchContact();
        }, false);
    },
    initRequest : function(){
        this.records = {}; 
        this.records.requestPage = 1; // 请求的页码
        this.records.totalPage = 1 ; //总页码
        this.records.isLoadingMore= true ; //可加载更多
        this.records.pageSize=28;
        document.querySelector(".list-view").innerHTML='<li class="loadMoreRow"><div class="loadMore"></div></li>';
    },
    initHeadBack : function(){  
        if(localStorage.app && localStorage.app=="cloudsignin"){
             document.querySelector("header a.back").style.display="none";
        }
    },
    departmentFilter : function(){
        var self=this;
        self.filterDialog({
            afterItemSelected : function(x){
                // 重置分页请求参数
                self.initRequest();
                self.getDepartLists( x.innerHTML);
            }
        });
    },
    getDepartLists : function(departmentName){
        var self=this;
        new ajax({
            type : "post",
            data : {
                // 公司id
                pbocCmpId: localStorage.pbocUserCmpId,
                // 部门名称
                pbocCmpDpName: departmentName,
                reqStart : self.records.requestPage==1 ? 1 : (self.records.requestPage-1)*self.records.pageSize+1,
                reqSize : self.records.pageSize
            },
            url:urlConf.addressList,
            success : function(data){   
                self.renderAddressList(data,"department",departmentName);
            }
        }) 
    },
    getAllLists : function(){  
        var self=this;
        new ajax({
            type : "post",
            data : {
                // 公司id
                pbocCmpId: localStorage.pbocUserCmpId,
                reqStart : self.records.requestPage==1 ? 1 : (self.records.requestPage-1)*self.records.pageSize+1,
                reqSize : self.records.pageSize
            },
            url:urlConf.addressList,
            success : function(data){    
                self.renderAddressList(data,"all","all");
            }
        })
    },
    renderAddressList : function(data,type,value){  
        var self=this;
        if(data.status=="0" && data.addressBook && data.addressBook.length>0){
            self.records.totalPage = data.totalPage || 1;
            self.appendRecords(data.addressBook,type,value);
        
            $(".list-view").unbind("click").bind("click","li.row",function(){
                var tel=$(this).find(".telphone").text();
                if(localStorage.platform=="ios"){
                     window.WebViewBridge.send("GZT_TPhone"+"&"+tel); 
                }else{
                    self.wpDialogConfirm({
                        text : tel,
                        okFn : function(){
                            self.dialogClose();
                            window.CloudSign.callPhone(tel);
                        }
                    })
                }
            })
        }else{
            document.querySelector(".list-view").innerHTML="";
            var error=data.error ? data.error : "获取通讯录失败啦!";
            if(type=="single"){
                error="对不起，没有您要查找的用户通讯记录！"
            }
            if(type=="department"){
                error="对不起，没有您要查找的部门通讯记录！"
            }
            toast(error)
        }
        document.querySelector(".list-view").addEventListener('scroll', function() { 
            self.onscrollEvent();
        }, false); 
    },
    searchContact : function(){
        var self=this;
        var name=document.querySelector(".search input");
        if(self.trim(name.value)==""){
            // 重置分页请求参数
            self.initRequest();
            self.getAllLists();
            return false;
        }else{
            new ajax({
                type : "post",
                data : {
                    // 公司id
                    pbocCmpId: localStorage.pbocUserCmpId,
                    // 用户名
                    pbocUserName: self.trim(name.value)
                },
                url:urlConf.addressList,
                success : function(data){     
                    self.renderAddressList(data,"single","single");
                }
            })
        }       
    },
    renderDeparts : function(){  
        var self=this;
        httpRequest("",urlConf.GetDps+"?pbocUserId="+localStorage.pbocUserId,self.getDepartments,3)  
    },
    getDepartments : function(data){  
        if(data.status=="0" && data.dps && data.dps.length>0){
            var tpl="";
             data.dps.forEach(function(dom,index){  
                tpl+='<span class="item">'+dom+'</span>'
            }) 
            $(".dialog .body .content").html(tpl);
        }else{
            toast(data.error? data.error : "获取公司部门失败啦！" )
        }
    },
    // 注册页面滚动事件
    onscrollEvent : function(){ 
        if(!this.records.isLoadingMore){
            return false;
        }
        // 这里的2为微调值
        if (this.getScrollTop() + this.getClientHeight()+2 >= this.getScrollHeight() ) {  
            this.records.requestPage = this.records.totalPage == 1 ? 1 : (this.records.requestPage + 1);
            this.records.isLoadingMore = this.records.requestPage > this.records.totalPage  ? false : true; 
            this._onEndReached();
        }
    },
    // 获取滚动条当前的位置
    getScrollTop : function(){
        return document.querySelector(".list-view").scrollTop || 0;
    },
    // 获取列表可视范围的高度
    getClientHeight : function(){
        //return $(".list-view").height();
        // 在声明了DOCTYPE的浏览器中，可以用以下来获取浏览器显示窗口大小：
        return document.querySelector(".list-view").clientHeight;
        
        // 在没有声明DOCTYPE的IE中，浏览器显示窗口高度只能以下获取：
        //return document.querySelector(".list-view").offsetHeight;
    },
    // 获取列表内容完整的高度
    getScrollHeight : function(){
        return document.querySelector(".list-view").scrollHeight;
    },
    // 到达滚动条底部
    _onEndReached : function(){
        var self=this;
        if ( self.records.totalPage == 1 || !self.records.isLoadingMore) {
            document.querySelector(".list-view .loadMore").innerHTML="已加载全部";
            return false; 
        } else {
            document.querySelector(".list-view .loadMore").innerHTML="<i></i><span>正在加载更多...</span>";
            var type=document.querySelector(".list-view").getAttribute("type");
            if(type=="all"){
                self.getAllLists(); 
                return false;
            }else{
                self.getDepartLists();
                return false;
            }
        }
    },
    appendRecords : function(arr,type,value){  
        var element=$(".list-view")
          , childNum = element.children().length;
        if( childNum == 1 ){
            element.prepend(this.dataToView(arr));
        } else if( childNum > 1 ){
            $(".list-view li:nth-last-child(2)").after(this.dataToView(arr));
        }
        element.attr("value",value);
        element.attr("type",type);
    },
    dataToView : function(arr){
        var tpl="";
        arr.forEach(function(dom,index){
            tpl+=
            '<li class="row">'+
                '<span class="name">'+dom.pbocUserName+'</span>'+
                '<span class="section">'+dom.pbocCmpDpName+'</span>'+
                '<span class="telphone">'+dom.pbocUserPhone+'</span>'+
            '</li>';
        })
        return tpl;
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
    historyBack : historyBack,
    /**
     * 提示框
     * @method filterDialog
     * @param {fn} Function 点击列表项后执行函数
     * @return {Null} 无返回值
     */
    filterDialog : function(options){   
        var self=this
          , dom=document.querySelector(".dialog")
          , domBg=document.querySelector(".dialog .bg")
          , domItems=document.querySelectorAll(".dialog .item");
        options.beforeShow && options.beforeShow();
        dom.style.display="block";   

        var hander=function(){   
            dom.style.display="none";
        }
  
        domBg.removeEventListener('click', hander, false);
        domBg.addEventListener('click', hander, false);  
        $(".dialog .item").unbind("click").bind("click",function(){
            $(this).addClass("selected").siblings().removeClass("selected");
            options.afterItemSelected && options.afterItemSelected(this); 
            hander();
        })  
    },
    siblings : function(dom,callback){
        var siblingElement = [];
        var parentAllElement = [];
        if( ! dom.parentNode ){
            return siblingElement;
        };
        parentAllElement = dom.parentNode.getElementsByTagName(dom.tagName);
        for( var i = 0; i < parentAllElement.length ; i++ ){
            if( parentAllElement[i] != dom ){
                siblingElement.push(parentAllElement[i]);
                typeof callback == "function" && callback.call(parentAllElement[i]);
            }
        }
        delete parentAllElement;
        return siblingElement;
    },
    wpDialogConfirm : function(options){ 
        var self=this;
        options.beforeShowFn && options.beforeShowFn();
        options.text && options.text!=="" ? self.dialogText.html(options.text) : null;
        self.dialog.show();
        self.wpAnimate(self.dialogBd,"zoomIn");
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
        self.wpAnimate(self.dialogBd,"zoomOut",function(){
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
    }
}

app.init();