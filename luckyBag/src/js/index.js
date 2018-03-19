/*!
 * index.js version: v1.0.0; author : Wangpq;
 * Date: 2018-02-06T18:00Z
 */
/********** 游戏对象 **********/
var App={
    init : function(){
        this._init();
        this.render();
        this.controls();
    },
    _init : function(){
        // 贵州通用户名(手机号)
        this.username=getUrlParam("username");
        // 分享状态
        this.shareTag=getUrlParam("sh");
        // platform
        this.platform=getUrlParam("platform");
    },
    render : function(){
        var self=this;

        FastClick.attach(document.body);
        if(self.shareTag!=="1"){
            self.initPage();
        }else{
            document.querySelector("section.index").style.display="none"; 
            document.querySelector("section.mine").style.display="none"; 
            document.querySelector("section.sharePage").style.display="block";
            self.autoLottery();
            self.autoDownload();
        }
    },
    controls : function(){
        var self=this;

        if(self.shareTag=="1"){
        }else{
            $(".btn-opt img").unbind("click").bind("click",function(){
                self.autoLottery();
            })
    
            $("section.mine .have>.item:last-child").unbind("click").bind("click",function(){
                GztUtil.showDialog({
                    type : "regs",
                    text : document.querySelector(".regular-html").innerHTML
                });
            })
        }
    },
    autoDownload : function(){
        var self=this
          , n= getUrlParam("platform") || core();
        switch(n) {
            case "android":
               $("#btnDownload_qdw").attr("href",urlconfig.androidDownload);
            break;
            case "ios":
               $("#btnDownload_qdw").attr("href",urlconfig.iosDownload);
            break;
            default:
               $("#btnDownload_qdw").attr("href",urlconfig.androidDownload);
        }
    },
    shareToFriends : function(){  
        GztShare._init({
            params : [
                {
                    title : "狗富贵，互相旺",
                    desc : "快来贵州通看我的新年祝福吧~",
                    img : dynsite+'/luckyBag/images/shareIcon.jpg',
                    url : dynsite+'/luckyBag/html/index.html?sh=1&username='+this.username
                }
            ],
            selector : "section.mine .btn-share",
            two : false
        }); 
    },
    initPage : function(){

        var self=this;
        $.ajax({
            url : urlconfig.hasLottery+"?tel="+getUrlParam("username"),
            type : "get",
            success : function(data){
                if(data){
                    hideLoading();
                    self.renderPageAjax(data);
                }
            },
            beforeSend: function(){
                showLoading();
            },
            error : function(){
                hideLoading();
            }
        });

        /*
        var self=this;
        var data={
            hasLottery : false
        }
        self.renderPageAjax(data);
        */
    },
    renderPageAjax : function(data){
      var self=this;
        if(data.hasLottery){
            document.querySelector("section.mine").style.display="block";
            self.autoLottery();
        }else{
            document.querySelector("section.index").style.display="block";
        } 
    },
    autoLottery : function(){
        var self=this;

        $.ajax({
            url : urlconfig.lottery+"?tel="+getUrlParam("username"),
            type : "get",
            success : function(data){
                if(data && data.result && data.result.resultCode==0){
                    hideLoading();
                    self.renderLottery(data.result);
                }
            },
            beforeSend: function(){
                showLoading();
            },
            error : function(){
                hideLoading();
            }
        });


        /*
        var self=this;
        var data={
            "result":{
                "hasLottery":true,
                "imgId":"2",
                "lotteryCount":20001,
                "resultCode":0,
                "resultMsg":"",
                "tel":"18701373448",
                "winList":[
                    {
                        "id":"555cf41a61f94cfc84a3f1705c275210",
                        "prizeid":2,
                        "reserve1":"1元云卡抵用券",
                        "reserve2":"2",
                        "tel":"18701373448",
                        "time":1517888318000
                    }
                ]
            }
        }
        self.renderLottery(data.result);
        */
    },
    renderLottery : function(data){
        /*
        "乾贷网礼包(666元红包)" : "img_666",
        "1元云卡抵用券" : "img_1yuan",
        "35元二合一数据线" : "img_xian",
        "洗衣液" : "img_xyy",
        "纸巾" : "img_zj"
        */
        var self=this
          , winList=data.winList
          , data2={
            "1" : "img_666",
            "2" : "img_1yuan",
            "3" : "img_xian",
            "4" : "img_xyy",
            "5" : "img_zj"
        }
        
        if(self.shareTag=="1"){
            // 已有N人领取新年福袋
            var imgId=parseInt(data.imgId)<10 ? "0"+data.imgId : data.imgId;
            $("section.sharePage .my-word>.content>img").attr("src","../images/jy_"+imgId+".png");
        }else{

            document.querySelector("section.index").style.display="none";

            var tpl="";
            for(var i=0,len=winList.length;i<len;i++){
                if(winList[i] ){
                    var btnDisplayTpl= (winList[i].prizeid==1 || winList[i].prizeid==2 ) ? '' : ' style="display:none;"';
                    
                    var desTpl= winList[i].prizeid==2 ? '<div class="des"><b>1元</b><span class="use-date">有效期15天</span></div>' : '<div class="des"><span class="use-date">客服与您联系，礼品邮寄</span></div>';
                    if(winList[i].prizeid==1){
                        desTpl=  '<div class="des"><span class="use-date">已发送到您乾贷网账户</span></div>'
                    }
                    
                    tpl+=
                    '<li>'+
                        '<div class="img">'+
                            '<img src="../images/'+data2[winList[i].prizeid]+'.jpg" alt="'+winList[i].reserve1+'">'+
                        '</div>'+
                        '<div class="text">'+
                            '<div class="m">'+
                                '<div class="name">'+winList[i].reserve1+'</div>'+desTpl+
                            '</div>'+
                        '</div>'+
                        '<div class="btn-box">'+
                            '<div class="m"><div class="btn" '+btnDisplayTpl+' data-num="'+winList[i].prizeid+'">立即使用</div></div>'+
                        '</div>'+
                    '</li>';
                }
            }
            $("section.mine .list").html(tpl);


            // 已有N人领取新年福袋
            var imgId=parseInt(data.imgId)<10 ? "0"+data.imgId : data.imgId;
            $("section.mine .my-word>.content>img").attr("src","../images/jy_"+imgId+".png");
            $("section.mine .have>.item:first-child b").html(data.lotteryCount);

            document.querySelector("section.mine").style.display="block";


            $("section.mine .list li>.btn-box>.m>.btn").unbind("click").bind("click",function(){
                if(  $(this).attr("data-num")==1 ){
                    GztUtil.showDialog({
                        type : "confirm",
                        text : document.querySelector(".confirm-html").innerHTML,
                        iconFn : function(){
                            window.localStorage.setItem("remember","true");
                        },
                        okFn : function(config){
                            if($(config.btnOk).hasClass("disable")){
                                return false;
                            }
                            GztUtil.dialogClose();
                            window.location.href="http://m.qiandw.com/?utm_source=gzt3&utm_medium=cpc&channel=gzt3&username="+self.username;
                        },
                        afterShowFn : function(config){
                            $(".confirm-box .remermber span.xy").unbind("click").bind("click",function(){
                            
                                var title=$(this).attr("value")
                                    , index=$(this).attr("index")
                                    , content="";
    
                                if(index==1){
                                    content=document.querySelector(".xy-qdw-html").innerHTML;
                                }else{
                                    content=document.querySelector(".xy-gzt-html").innerHTML;
                                }
    
                                GztUtil.showAlert({
                                    type : "alert",
                                    title : title,
                                    text : content, 
                                }); 
                            })
                        }
                    }); 
                }else{  
                    historyBack();
                }

            })

            self.shareToFriends();
        }
    }
}

$(function(){
    App.init();
})
