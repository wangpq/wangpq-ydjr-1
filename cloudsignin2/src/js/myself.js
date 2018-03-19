function getVersion(version){
    //alert("getVersion="+version);
    if(version && version!==""){
        app.version=true;
        document.getElementById("alert").style.display="none";
        document.querySelector(".versions").innerHTML="v"+String(version);
        //alert("进入getVersion if语句，赋值veision成功");
    }else{
        app.version=false;
    }
}

/*!
 * myself.js version: v1.0.0; author : Wangpq;
 * Date: 2017-07-17T11:30Z
 */
var app={
    init : function(){
        this.render();
        this.controls();
    },
    render : function(){
        FastClick.attach(document.body);
        this.initHeadBack();
        //this.initVersion();
        this.initViews();
    },
    initViews : function(){
        document.querySelector(".show-set .name").innerHTML=localStorage.pbocUserName;
        document.querySelector(".show-set .company").innerHTML=localStorage.pbocUserCmp;
        document.querySelector(".show-set .tel").innerHTML=localStorage.pbocUserPhone;
    },
    controls : function(){
        var self=this;
        // 返回
        document.querySelector("header .back").addEventListener('click', function() {
            self.historyBack();
        }, false);

        self.shareCloudLinks="";
        if( localStorage.platform=="ios"){
            self.shareCloudLinks='https://itunes.apple.com/us/app/云签到/id1215556686?l=zh&ls=1&mt=8'
        }else{
            self.shareCloudLinks='http://222.85.161.58:12306/app/CloundSign.apk'
        }
        GztShare._init({
            params : [
                {
                    name : "贵州通",
                    title : '贵州通-“长”到手机里的公交卡',
                    desc : "云签到、云卡乘公交、公共事业缴费、公交查询、小客车摇号、随时随心安享信用服务。",
                    img : dynsite+'/cloudsignin/images/shareIcon.jpg',
                    url : "http://www.gztpay.com:80/download/index.action"
                },
                {
                    name : "云签到",
                    title : "云签到-最好用的移动智能考勤系统",
                    desc : "签到规则自定义、一天打卡次数自定义、工龄管理、年假管理，智能考勤系统，解放人力工作量，让效率飞起来！",
                    img : dynsite+'/cloudsignin/images/shareIcon.jpg',
                    url : self.shareCloudLinks
                }
            ],
            selector : ".do .m:first-child .icon",
            two : true
        });
    },
    initHeadBack : function(){
        if(localStorage.app && localStorage.app=="cloudsignin"){
             document.querySelector("header a.back").style.display="none";
        }
    },
    initVersion : function(){
        var self=this;
        if(localStorage.app && localStorage.app=="cloudsignin" && localStorage.platform !== "ios"){
            var timer=window.setTimeout(function(){
                if(!self.version){
                    var dialogDom=document.getElementById("alert");
                    dialogDom.style.display="block";
                    dialogDom.querySelector("#alert .close").addEventListener('click', function() {
                        dialogDom.style.display="none";
                    }, false);
                }
                window.clearTimeout(timer);
            },980) 
        }
    },
    /**
     * 返回并刷新
     * @method historyBack
     * @return {Null} 无返回值
     */
    historyBack : historyBack
}


app.init();
