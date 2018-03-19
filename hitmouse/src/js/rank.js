/*!
 * index.js version: v1.0.0; author : Wangpq;
 * Date: 2017-12-08T17:00Z
 */
/********** 游戏对象 **********/
var Rank={
    init : function(){
        this._init();
        this.render();
        this.controls();
    },
    _init : function(){
    },
    render : function(){
        var self=this;
        FastClick.attach(document.body);

        self.requestUserPrize();
    },
    controls : function(){
        var self=this;
        $("header a.back").unbind("click").bind("click",function(){
            window.history.back();
        })
    },
    requestUserPrize : function(){ 
	    var self=this
		, tpl="" 
        , node=$("#rankPage .list .bd .body");

        var ajaxCallback=function(data){
            var arr=[];
            if(data && data.obj &&  data.obj.length>0){
                arr=data.obj;
                var len=arr.length>50 ? 50 : arr.length;
                for(var i=0;i<len;i++){
                    if(arr[i].userid!=="" && arr[i].userid!=="null" ){
                        tpl+=
                        '<li>'+
                            '<span>'+GztUtil.formatTelStars(arr[i].userid)+'</span>'+
                            '<span>'+arr[i].maxintegral+'</span>'+
                            '<span>'+arr[i].rank+'</span>'+
                        '</li>'; 
                    }
                }
            }

            node.html(tpl);
        }
 
        $.ajax({
            type : "post",
            url : urlconfig.rankAll,
            beforeSend : function(){
                GztUtil.loadingFn(node,GztUtil.ajaxConfig.loadSimpleText);
            },
            success : function(data){ 
                GztUtil.loadEndFn(node);
                var data=JSON.parse(data);  
                if(data){
					ajaxCallback(data);
                }
            },
            fail : function(){
                GztUtil.loadEndFn(node);
            }
        });
    }
}

$(function(){
    Rank.init();
})


