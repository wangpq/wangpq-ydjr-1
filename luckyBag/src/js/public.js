function showLoading(msg) {
	if(document.getElementById("loading")==null){
		var tpl=document.createElement('div')
		  , displayStr="none"
		  , textStr="正在加载中..."
		  , loadTpl="";
		tpl.id="loading";
		tpl.classList.add("loading");
		tpl.classList.add("hasText");
		displayStr="block";

		if(msg){
            textStr = msg;
		}
		loadTpl=
			'<div class="c">'+
				'<div class="body">'+
					'<div class="img"></div>'+
					'<div class="text" style="display:'+displayStr+'">'+textStr+'</div>'+
				'</div>'+
			'</div>'+
            '<div class="bg"></div>';
        tpl.innerHTML=loadTpl;
        document.body.appendChild(tpl);
    }else{
		!!msg ? document.getElementById("loading").querySelector(".text").innerHTML=msg : null;
 		document.getElementById("loading").classList.remove("invisible");
	}
}

function hideLoading() {
     document.getElementById("loading").classList.add("invisible");
}

function autoLoading(msg,time){
    showLoading(msg);
    var time= time || 1200;
    var timer=window.setTimeout(function(){
        window.clearTimeout(timer);
        hideLoading();
    },time)
}

/**
 * 获取某个地址栏参数
 * @method getUrlParam
 * @param {name} String 要获取的参数
 * @return {Null} 返回一个字符串或者null
 */
function getUrlParam(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}

function core(){
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

/**
 * 返回并刷新
 * @method historyBack
 * @return {Null} 无返回值
 */
function historyBack(){
	var platform = getUrlParam("platform");
	if (platform == "ios") {
		try{
			window.WebViewBridge.send("closeWebview");
		}catch(e){
			window.webkit && window.webkit.messageHandlers.closeWebview.postMessage(null);
		}
	}else if(platform == 'android'){
		var isLocation = getUrlParam('isLocation');
		if(isLocation == 'yes'){
			window.history.back();
		}else{
			window.gztObj.finishPage();
		}
	}else{
    }
}
