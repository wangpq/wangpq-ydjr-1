/*弹出提示信息*/
function toast(msg,time) {
	showToast(msg);
	window.setTimeout(function() {
		hideToast(msg);
	}, time ? time : 5000);
}

function showToast(msg) {
	if(document.querySelector(".toast")==null){
		var tpl=document.createElement('div');
		tpl.classList.add("toast");
		tpl.innerHTML='<div class="tip">'+msg+'</div>';
		document.body.appendChild(tpl);
	}else{
		document.querySelector(".toast .tip").innerHTML=msg;
		document.querySelector(".toast").classList.remove("invisible");
	}
}

function hideToast(msg) {
	document.querySelector(".toast").classList.add("invisible");
}

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
     document.getElementById("loading").querySelector(".text").innerHTML="正在加载中...";
 };

function autoLoading(msg,time){
    showLoading(msg);
    var time= time || 1200;
    var timer=window.setTimeout(function(){
        window.clearTimeout(timer);
        hideLoading();
    },time)
}


/**
 * 获取地址栏url参数
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}
