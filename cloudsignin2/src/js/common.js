/*弹出提示信息*/
function toast(msg,time) { 
	showToast(msg);
	window.setTimeout(function() {
		hiddenToast(msg);
	}, time ? time : 3000);
}

function showToast(msg) {
	if(document.querySelector(".toast")==null){
		var tpl=document.createElement('div'); 
		tpl.classList.add("toast");
		tpl.innerHTML='<div class="tip">'+msg+'</div>';
		document.body.appendChild(tpl);
	}else{
		document.querySelector(".toast .tip").innerHTML=msg;
		document.querySelector(".toast").classList.remove("invisibile");
	}
}

function hiddenToast(msg) {
	document.querySelector(".toast").classList.add("invisibile");
};

 /*发起网络请求*/
 function httpRequest(data , url , fn , num) {
    //1.创建XMLHttpRequest组建    
    xmlHttpRequest = new XMLHttpRequest();
    //2.设置回调函数    
    xmlHttpRequest.onreadystatechange = function() {　　　　
        if (xmlHttpRequest.readyState == 4) {
            if (xmlHttpRequest.status == 200) {
                var data=typeof(xmlHttpRequest.responseText)==="string" ? JSON.parse(xmlHttpRequest.responseText)  : xmlHttpRequest.responseText;
                fn(data);
            } else if( xmlHttpRequest.status == 404 ){
                //$("#loading").addClass("invisibile");
                document.getElementById("loading").classList.add("invisibile");
                toast("接口404，请后台人员进行排查。");
            }else {
                //$("#loading").addClass("invisibile");
                document.getElementById("loading").classList.add("invisibile");
                toast("网络不通，请运维人员进行排查。");
                // toast("网络不通，请运维人员进行排查" + xmlHttpRequest.readyState +"-----status = "+xmlHttpRequest.status);
            }
        } else {
            // toast("怎么失败了？readyState = " + xmlHttpRequest.readyState);
        }　
    };

    //3.初始化XMLHttpRequest组建    
    xmlHttpRequest.open("POST", url, true);

    // xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    // xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    //4.发送请求    
    if( "" == data ){
        xmlHttpRequest.send();
    } else {
        xmlHttpRequest.send(data);
    }
    // 捕获网络请求失败情况
    xmlHttpRequest.onerror = function(){
        toast("网速缓慢，请重试");
        /*num--;
        if (num > 0) {
            httpRequest( data , url , fn , num )
        }*/
    };
};

/**
 * 获取地址栏url参数
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}

// localStorage维护全局数组
function changeObj(key,value){
    var temp = JSON.parse(localStorage.appiont);
    temp[key]= value;
    localStorage.appiont = JSON.stringify(temp);
}
 
// 自定义AJAX
;(function(window,undefined){
	function wAjax(){
		this.constructor.apply(this, arguments);
	}
	wAjax.prototype = {
		empty : function(){},
		options : { 
			url:null,
			data:null,
			dataType:"json",
			type:"get",
			async  : true,
			beforeSend: this.empty,
			success: this.empty,
			complate : this.empty,
			error: this.empty,
			overTime : 5, //超时定义为5S
			interval: null || false  
		},
		extend : function(target) {
			var slice = Array.prototype.slice;
			slice.call(arguments, 1).forEach(function(source) {
				for (key in source)
				if (source[key] !== undefined)
					target[key] = source[key]
			})
			return target
		},
		constructor:function(options){
			this.setOptions(options);
			this.init(this.options);
		},
		setOptions:function(options){
			this.extend(this.options, options || {});
		},
		init : function(){
			this.xhr=(window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
			typeof(this.options.interval)=="number" ? this.timer() : this.operate();
		},
		timer : function(){ 
			var self=this;
			window.clearInterval(self.intervalTimer);
			self.intervalTimer=window.setInterval(function(){   
				self.operate(); 
			},self.options.interval)	
		},
		formatDatas : function(data){
			var str="";
			for(var key in data){
				str+=encodeURIComponent(key)+"="+ encodeURIComponent(data[key])+"&";	
			}	
			return str.slice(0,-1);  
		},
		operate : function(){  
			var self=this; 
			if(self.xhr){ 
     
				if(typeof(self.options.data)=="object")	{
					if(this.options.type=="get")
				        self.options.data=self.formatDatas( self.options.data );
					else
				        self.options.data=JSON.stringify(self.options.data);
				}
			
				if(self.options.type=="get")
					self.options.url=self.options.url+'?'+self.options.data;
				
				if(self.options.type=="post")
				    null;
					//self.xhr.setRequestHeader("Content-Type","application/json");
					//self.xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				
				self.xhr.open(self.options.type,self.options.url,self.options.async);
                
				// 这里的send()必须接受一个参数，即：要作为请求主体发送的数据。如果不需要通过请求主体发送数据，则必须传入 null ，因为不传入的话，有些浏览器会报错。
				self.options.type=="post" ? self.xhr.send( self.options.data ) : self.xhr.send(null);

                /*
                self.isCancelRequest = window.setTimeout(function(){
					self.xhr.abort();
					toast('请求超时'+self.options.overTime+'秒取消本次请求!');	
				},self.options.overTime*1000);
                */

				self.xhr.onreadystatechange=function(){
					if (self.xhr.readyState<4){
						self.options.beforeSend && self.options.beforeSend();
					}
					if(self.xhr.readyState==4 ){
						if(self.xhr.status==200){
							var  res;
							switch(self.options.dataType){
								case 'html':
									res = self.xhr.responseText; 
								break
								case 'xml':
									res = self.xhr.responseXML ;
								break
								case 'json':
									res=typeof(self.xhr.responseText)==="string" ? JSON.parse(self.xhr.responseText)  : self.xhr.responseText;
								break
								default:
									res = self.xhr.responseText; 
							}
							self.options.success && self.options.success(res);
							self.options.complate && self.options.complate(res);
							//window.clearTimeout(self.isCancelRequest);
						}else if(self.xhr.status==404){
							document.getElementById("loading").classList.add("invisibile");
							toast("接口404，请后台人员进行排查。");
							self.options.error && self.options.error(self.xhr.status);
							self.options.complate && self.options.complate(res);
						}else{
							document.getElementById("loading").classList.add("invisibile");
							toast("网络不通，请运维人员进行排查。");	
						    self.options.error && self.options.error(self.xhr.status);
							self.options.complate && self.options.complate(res);					
						}
					}else{
						/*
						document.getElementById("loading").classList.add("invisibile");
						toast("请求接口出错啦！");	
						self.options.error && self.options.error(self.xhr.readyState);
						*/
					}		
				}

				// 捕获网络请求失败情况
				self.xhr.onerror = function(){
					toast("网速缓慢，请重试");
				};
		    }
		}
	}


	window.ajax= window.wAjax= wAjax;

})(window);


/**
 * 返回并刷新
 * @method historyBack
 * @return {Null} 无返回值
 */
function historyBack(){
	var platform = localStorage.platform;
	if (platform == "ios") {
		var href=window.location.href;
		if(href.indexOf("index")>-1 || href.indexOf("enter")>-1 ){
		    window.WebViewBridge.send("closeWebview");
		}else{
		    window.history.back(-1);
		}
	}else {
		try{
            window.CloudSign.htmlCallBack();
		}catch(x){
		    window.history.back(-1);
		}
	}
}


/*回退*/
function canBack(){
    window.CloudSign.htmlCallBack();
}

var platform=localStorage.platform;
if( localStorage.platform=="ios" ) {
} else{
	try{
		var href=window.location.href
		  , str="default";
		if(href.indexOf("index")>-1 || href.indexOf("enter")>-1 || href.indexOf("distribute")>-1){
			str="h5rights";
		}
		window.gztObj.recoderInterface(str);
	}catch(e){
	}	
}