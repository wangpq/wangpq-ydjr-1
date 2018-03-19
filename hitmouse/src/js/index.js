/*!
 * index.js version: v1.0.0; author : Wangpq;
 * Date: 2017-12-08T17:00Z
 */
/********** 游戏对象 **********/
var Game={
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
        this.platform=getUrlParam("platform") || core() ;
        // 游戏活动结束时间
        this.gameEndDate="20180207";
        //游戏中
        this.playing=false;
        // 地鼠向上运动时间
        this.mouseMoveUpTime=1000;
        // 地鼠向下运动时间
        this.mouseMoveDownTime=300;
        // 地鼠运动调剂时间
        this.mouseMoveVar=0;
        //地鼠出现时间间隔(每隔X时间出现一只地鼠)
        this.mouseGenerateTime=(this.mouseMoveUpTime+this.mouseMoveDownTime-this.mouseMoveVar);
        // 游戏最高分
        this.maxGameScore=0;
        //本轮次获得积分
        this.score=0;
        //产生地鼠个数
        this.mouseNums = 0;
        //产生地雷个数
        this.landmineNums=0;
        //鼠标点中地鼠次数
        this.beatNums=0;
        //指定setInterval()的变量(隔X出现一只地鼠)
        this.mouseGenerateTimer=null;
        //地鼠的随机类型数组
        this.mouseTypeArr=["A","A","A","B","A","A","A","A"];
        //地鼠的随机类型数组长度
        this.mouseTypeArrLen=this.mouseTypeArr.length;
        // 游戏得等级(根据等级来确定出现的地鼠个数)
        this.level=1;
        // 当天游戏玩过次数
        this.todayAlreadyPlayNums=1;
        // 每天最多玩游戏次数(默认10局游戏)
        this.maxDayPlayNums=10;
        // 漏掉多少只地鼠游戏结束
        this.loseHitNums=3;
        // 游戏不同难度等级的积分数组
        this.levelScoreArr=[30,95,180,210,235,255,280];
        // 获得话费的积分数组
        this.degreeScoreArr=[180,235,280];
        // 启动游戏锤子
        this.btnStart=document.querySelector("#one .yd-bd .bd .start");
        // 游戏得分dom节点
        this.scoreNode=document.querySelector("#one .yd-bd .bd .score>span");
        // 地洞是否拥有地鼠状态数组
        this.mouseStatusArr=[];
        // 初始化地鼠状态
        this.initMouseStatus();
    },
    render : function(){
        var self=this;

        FastClick.attach(document.body);

        if(self.shareTag=='1'){
            // 让洞里都填满地鼠
            document.querySelector(".houses").classList.add("share");
            document.querySelector("#one header").style.display="none";
            document.querySelector("#one .yd-bd .rank").innerHTML="";
            document.querySelector("#one .yd-bd .integrate").innerHTML="";

            // 分享页下载栏
            self.autoDownLoad();
        }
    },
    controls : function(){
        var self=this;
        // 和游戏无关的控制器
        self.gameOtherControls();
        if(self.shareTag!=='1'){
            // 与游戏相关
            self.gameStart();
        }
    },
    gameOtherControls : function(){
        var self=this;

        // 游戏页返回
        $("header a.back").unbind("click").bind("click",function(){
            historyBack();
        })

        // 点击活动规则
        document.querySelector("#one .hd .b .regular").addEventListener("click",function(){
            GztUtil.showDialog({
                type : "regs",
                text : document.querySelector(".regular-html").innerHTML
            });
        },false)

        if(self.shareTag!=='1'){
            // 排名
            $("#one .yd-bd .hd .t .rank").unbind("click").bind("click",function(){
                window.location.href='./rank.html';
            })
        }
        // 分享
        self.shareToFriends();

        // 自动展示页面
        self.autoShowPage();

        // hash
        window.addEventListener('hashchange', function(e) {
            var re = /#one$/;
            if ( re.test(e.oldURL) && !re.test(e.newURL) ) {
                GztUtil.showPage('two');
            }
            var re2 = /#two$/;
            if ( re2.test(e.oldURL) && !re2.test(e.newURL) ) {
                GztUtil.showPage('one');
            }
        }, false);
    },
    autoDownLoad : function(){
        var download=$(".download")
          , btn=$(".download a");
        download.show();
        switch(this.platform) {
            case "android":
                btn.attr("href","http://a.app.qq.com/o/simple.jsp?pkgname=com.suma.gztong");
                break;
            case "ios":
                btn.attr("href","https://itunes.apple.com/cn/app/%E8%B4%B5%E5%B7%9E%E9%80%9A%E5%9C%A8%E7%BA%BF/id1194447981?mt=8");
                break;
            default:
                btn.attr("href","http://a.app.qq.com/o/simple.jsp?pkgname=com.suma.gztong");
        }
        download.find(".close").unbind("click").bind("click",function(){
            download.hide();
        })
    },
    initMouseStatus : function(){
        for(var i=0;i<9;i++){
            this.mouseStatusArr.push({
                active : false
            })
        }
    },
    shareToFriends : function(){
        GztShare._init({
            params : [
                {
                    title : "疯狂打地鼠·赢双节壕礼",
                    desc : "打地鼠赢壕礼，神秘奖品等着你！",
                    img : dynsite+'/hitmouse/images/shareIcon.jpg',
                    url : dynsite+'/hitmouse/html/index.html?sh=1'
                }
            ],
            selector : "header a.share",
            two : false
        });
    },
    autoShowPage : function(){
        var self=this;

        // 赋值排名、最高分
        if(self.shareTag!=="1"){
            var tempTimer=window.setTimeout(function(){
                self.requestGamePage();
                window.clearTimeout(tempTimer);
            },80)

            if(GztUtil.getToday()>=self.gameEndDate){
                window.location.hash='two';
                GztUtil.showPage('two');

                // 获奖名单
                var tempTimer1=window.setTimeout(function(){
                    self.requestPrizePage();
                    window.clearTimeout(tempTimer1);
                },80)

            }else{
                window.location.hash='one';
                GztUtil.showPage('one');

                self.createSnow();
                window.clearInterval(self.snowTimer);
                self.snowTimer=window.setInterval(function(){
                    self.createSnow();
                },10000);
            }
        }else{
            window.location.hash='one';
            GztUtil.showPage('one');

            self.createSnow();
            window.clearInterval(self.snowTimer);
            self.snowTimer=window.setInterval(function(){
                self.createSnow();
            },10000);
        }
    },
    createSnow : function(){
        var self=this;
        var vue= GztUtil.randomNumBoth(3,6);
        var hdHeight=$(window).height();
        new Snow({
            parentNode : $("#one .yd-bd .hd"),
            distance : hdHeight,
            stayTime : 28000
        });
    },
    requestPrizePage : function(){
        var self=this;
        self.requestUserPrize();
    },
    getMyPrize : function(num){
	    var self=this;
        $.ajax({
            type : "post",
            url : urlconfig.rechargePhone,
            data : {
                userid : self.username,
                money : num
            },
            beforeSend : function(){
                showLoading();
            },
            success : function(res){
                var data=JSON.parse(res);
                if(data && data.status==0){
                    hideLoading();
                    self.getMyPrizeAction();
                }
            },
            error : function(){
                hideLoading();
            }
        })
    },
    /**
     * 成功领取话费
     */
    getMyPrizeAction : function(){
        var botImgNode=$("#two .result img");
        botImgNode.attr("src",botImgNode.attr("src").replace("yuan.",'yuanSuccess.'));
        GztUtil.showDialog({
            type : "img",
            img : "getsuccess.png"
        })
    },
    requestUserPrize : function(){
	    var self=this
		, tpl=""
        , node=$("#two .list .bd .body");

        /*
        var data={
            "status":"0",
            "obj":[
                {
                    "userid":"15885089556",
                    "maxintegral":0,
                    "updatetime":null,
                    "createtime":1512552265000,
                    "rank":2,
                    "alreadyPlay":null
                }
            ]
        }

        ajaxCallback(data.list);

        */

        var ajaxCallback=function(data){
            var arr=[];
            if(data && data.obj &&  data.obj.length>0){
                arr=data.obj;
                var len=arr.length>43 ? 43 : arr.length;
                for(var i=0,l=len;i<l;i++){
                    if(arr[i].userid!=="" && arr[i].userid!=="null" ){
                        tpl+=
                        '<li>'+
                            '<span>'+GztUtil.formatTelStars(arr[i].userid)+'</span>'+
                            '<span>'+arr[i].maxintegral+'</span>'+
                            '<span>'+arr[i].rank+'</span>'+
                            '<span>'+self.autoRankToPrize(arr[i].rank)+'</span>'+
                            '<span>'+self.autoRankToAward(arr[i].rank)+'</span>'+
                        '</li>';
                    }
                }
            }

            node.html(tpl);

            var botImgNode=$("#two .result img");
            botImgNode.unbind("click").bind("click",function(){
                if(botImgNode.attr("data-tag")=="false"){
                    self.getMyPrize(botImgNode.attr("data-value"));
                }
            })
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

    },
    autoRankToPrize : function(rank){
        var rank=parseInt(rank);
        if(rank==1){
            return "一等奖";
        }else if(rank<=6){
            return "二等奖";
        }else if(rank<=9){
            return "三等奖";
        }else if(rank<=12){
            return "四等奖";
        }else if(rank<=27){
            return "五等奖";
        }else if(rank<=33){
            return "六等奖";
        }else if(rank<=43){
            return "七等奖";
        }else{
            return "---";
        }
    },
    autoRankToAward : function(rank){
        var rank=parseInt(rank);
        if(rank==1){
            return "千元智能手机（1名）";
        }else if(rank<=6){
            return "精美陶瓷茶叶礼盒（5名）";
        }else if(rank<=9){
            return "限量版公交异形卡（3名）";
        }else if(rank<=12){
            return "mini加湿器（3名）";
        }else if(rank<=27){
            return "精美小夜灯（15名）";
        }else if(rank<=33){
            return "简约风帆布袋（6名）";
        }else if(rank<=43){
            return "创意懒人果壳（10名）";
        }else{
            return "---";
        }
    },
    requestGamePage : function(){
        var self=this;
        $.ajax({
            type : "post",
            url : urlconfig.getIndexInfo,
            data : {
                userid : self.username
            },
            success : function(res){
                var data=JSON.parse(res);
                if(data && data.status==0 && data.obj){
                    // 获奖页面
                    if(GztUtil.getToday()>=self.gameEndDate){
                        // 显示获得话费
                        self.autoRenderCost(data.obj.maxintegral,data.obj.reserve1);
                    }
                    // 游戏主页
                    else{
                        self.todayAlreadyPlay(data);
                        self.renderRankAndIntegrate(data);
                    }
                }
            },
            error : function(){
            }
        })

        /*
        var data={
            "status":"0",
            "obj":{
                "userid":"18701373448",
                "maxintegral":0,
                "updatetime":null,
                "createtime":1512552308000,
                "rank":2,
                "alreadyPlay":0
            }
        }
        self.todayAlreadyPlay(data);
        self.renderRankAndIntegrate(data);
        */
    },
    autoRenderCost : function(score,tag){
        var num=0;
        if(score>=this.degreeScoreArr[2]){
            num=3;
        }else if(score>=this.degreeScoreArr[1]){
            num=2;
        }else if(score>=this.degreeScoreArr[0]){
            num=1;
        }
        if(num>0){
            var botImgNode=$("#two .result img"),
                yuanStr= tag=="false" ? 'yuan.png' : 'yuanSuccess.png';
            $("#two .result").show();
            botImgNode.attr("src",botImgNode.attr("data-src")+num+yuanStr);
            botImgNode.attr("data-value",num);
            botImgNode.attr("data-tag",tag);
        }
    },
    todayAlreadyPlay : function(data){
        var data=data.obj;

        //data.alreadyPlay=1;

        this.todayAlreadyPlayNums=data.alreadyPlay;
        if(data && data.alreadyPlay>=this.maxDayPlayNums){
            this.overTenPlayTips();
        }
        // 启动游戏锤子
        if(this.todayAlreadyPlayNums<this.maxDayPlayNums){
            this.btnStart.style.display="block";
            this.btnStart.classList.add("hammerStartIn");
        }
    },
    // 赋值最高分、排名
    renderRankAndIntegrate : function(data){
        var self=this;
        if(data && data.obj){
            var data=data.obj,
                parentNode=document.querySelector("#one .hd .t");
            parentNode.querySelector(".integrate span").innerHTML=data.maxintegral;
            parentNode.querySelector(".rank span").innerHTML=data.rank;
            self.maxGameScore=parseInt(data.maxintegral);
        }
    },
    gameReset : function(){
        window.location.reload();
    },
    gameStart : function(){
        var self=this;
        // 点击启动游戏锤子
        $(self.btnStart).unbind("click").bind("click",function(){
            if(self.todayAlreadyPlayNums<self.maxDayPlayNums){
                self.btnStart.classList.remove("hammerStartIn");
                self.btnStart.classList.add("hammerStartOut");
                var count_down_music="";
                self.countDown({
                    beforeStartFn : function(){
                        WpAudio.play("game_music_start");
                    },
                    startFn : function(){
                        // 游戏进行中
                        self.playing=true;
                        self.btnStart.classList.remove("hammerStartOut");
                        self.btnStart.style.display="none";
                        var timer=window.setTimeout(function(){
                            self.createMouses();
                            window.clearTimeout(timer);
                        },1000)
                    }
                });
            }
        })
    },
    /**
     * 倒计时
     */
    countDown : function(options){
        var i=3,
            countDownNode =document.querySelector(".count-down"),
            countDownTxt=countDownNode.querySelector(".txt");
        countDownNode.style.display="block";
        options.beforeStartFn && options.beforeStartFn();
        var timer=window.setInterval(function(){
           if(i>0){
               i--;
               if(i==0){
                   countDownTxt.innerHTML="GO";
                   options.startFn && options.startFn();
                   window.clearInterval(timer);
                   var timer2=window.setTimeout(function(){
                       countDownNode.style.display="none";
                       window.clearTimeout(timer2);
                   },1000)
               }else{
                  countDownTxt.innerHTML=i;
               }
           }
        },1000)
    },
    createMouses : function(){
        var self=this;
        /*
        self.mouseGenerateTimer=window.setInterval(function(){
            if(self.level==1){
                self.newOneMouseNode();
            }
            else if(self.level==2){
                self.newTwoMouseNode();
            }
            else if(self.level==3){
                self.newThreeMouseNode();
            }
            else if(self.level==4){
                self.mouseTypeArr=["A","A","A","B","A","A","A","A"];

                var num=GztUtil.randomNumBoth(2,4);
                if(num==2){
                    self.newTwoMouseNode();
                }else if(num==3){
                    self.newThreeMouseNode();
                }else{
                    self.newFourMouseNode();
                }
            }
            else if(self.level==5){
                self.mouseTypeArr=["A","A","A","A","A","A","A","B"];

                var num=GztUtil.randomNumBoth(2,4);
                if(num==2){
                    self.newTwoMouseNode();
                }else if(num==3){
                    self.newThreeMouseNode();
                }else{
                    self.newFourMouseNode();
                }
            }
            else{
            }
        },self.mouseGenerateTime);
        */
        self.mouseGenerateTimer=window.setInterval(function(){
            if(self.level==1 || self.level==2 || self.level==3){
            }
            else if(self.level==4){
                self.mouseTypeArr=["A","A","A","B","A","A","A","A"];
            }
            else if(self.level==5){
                self.mouseTypeArr=["A","B","A","A","A","A","B","A"];
            }
            else if(self.level==6){
                self.mouseTypeArr=["A","A","A","B","B","A","A","A"];
            }
            else if(self.level==7){
                self.mouseTypeArr=["A","B","A","A","A","A","A","B"];
            }
            else{
            }
            self.newOneMouseNode();
        },self.mouseGenerateTime);

    },
    newOneMouseNode : function(){
        var self=this;
        var index = GztUtil.randomNumBoth(0,8),
            type=self.mouseTypeArr[GztUtil.randomNumBoth(0,self.mouseTypeArrLen-1)];
        while(self.mouseStatusArr[index].active){
            index = GztUtil.randomNumBoth(0,8);
        }
        self.newMouseNode(index,type);
    },
    newTwoMouseNode : function(){
        var self=this;         /*
        var index_1 = GztUtil.randomNumBoth(0,8),
            type_1=self.mouseTypeArr[GztUtil.randomNumBoth(0,self.mouseTypeArrLen-1)],
            index_2 = GztUtil.randomNumBoth(0,8),
            type_2=self.mouseTypeArr[GztUtil.randomNumBoth(0,self.mouseTypeArrLen-1)];
        while(index_1==index_2){
            index_2 = GztUtil.randomNumBoth(0,8);
        }
        self.newMouseNode(index_1,type_1);
        self.newMouseNode(index_2,type_2);
        */
        /*
        self.newOneMouseNode();

        */
        self.newOneMouseNode();
        var timer=window.setTimeout(function(){
            self.newOneMouseNode();
            window.clearTimeout(timer);
        },self.mouseGenerateTime)
    },
    newThreeMouseNode : function(){
        var self=this;  /*
        var index_1 = GztUtil.randomNumBoth(0,8),
            type_1=self.mouseTypeArr[GztUtil.randomNumBoth(0,self.mouseTypeArrLen-1)],
            index_2 = GztUtil.randomNumBoth(0,8),
            type_2=self.mouseTypeArr[GztUtil.randomNumBoth(0,self.mouseTypeArrLen-1)],
            index_3 = GztUtil.randomNumBoth(0,8),
            type_3=self.mouseTypeArr[GztUtil.randomNumBoth(0,self.mouseTypeArrLen-1)];
        while(index_1==index_2){
            index_2 = GztUtil.randomNumBoth(0,8);
        }
        while(index_1==index_3 || index_2==index_3){
            index_3 = GztUtil.randomNumBoth(0,8);
        }

        self.newMouseNode(index_1,type_1);
        self.newMouseNode(index_2,type_2);
        self.newMouseNode(index_3,type_3);
        */

        /*
        self.newOneMouseNode();
        self.newOneMouseNode();
        self.newOneMouseNode();
        */

        var num=0;
        self.newOneMouseNode();
        var timer=window.setTimeout(function(){
            num+=1;
            if(num<3){
                self.newOneMouseNode();
            }
            window.clearTimeout(timer);
        },self.mouseGenerateTime)
    },
    newFourMouseNode : function(){
        var self=this;
        /*
        var index_1 = GztUtil.randomNumBoth(0,8),
            type_1=self.mouseTypeArr[GztUtil.randomNumBoth(0,self.mouseTypeArrLen-1)],
            index_2 = GztUtil.randomNumBoth(0,8),
            type_2=self.mouseTypeArr[GztUtil.randomNumBoth(0,self.mouseTypeArrLen-1)],
            index_3 = GztUtil.randomNumBoth(0,8),
            type_3=self.mouseTypeArr[GztUtil.randomNumBoth(0,self.mouseTypeArrLen-1)],
            index_4 = GztUtil.randomNumBoth(0,8),
            type_4=self.mouseTypeArr[GztUtil.randomNumBoth(0,self.mouseTypeArrLen-1)];
        while(index_1==index_2){
            index_2 = GztUtil.randomNumBoth(0,8);
        }
        while(index_1==index_3 || index_2==index_3){
            index_3 = GztUtil.randomNumBoth(0,8);
        }
        while(index_1==index_4 || index_2==index_4 || index_3==index_4){
            index_4 = GztUtil.randomNumBoth(0,8);
        }
        self.newMouseNode(index_1,type_1);
        self.newMouseNode(index_2,type_2);
        self.newMouseNode(index_3,type_3);
        self.newMouseNode(index_4,type_4);
        */

        var num=0;
        self.newOneMouseNode();
        var timer=window.setTimeout(function(){
            num+=1;
            if(num<4){
                self.newOneMouseNode();
            }
            window.clearTimeout(timer);
        },self.mouseGenerateTime)
    },
    newMouseNode : function(index,type){
        var self=this;
        var mouseNode=new Mouse({
            index : index,
            type : type ,
            moveUpTime : self.mouseMoveUpTime,
            moveDownTime : self.mouseMoveDownTime,
            onGenerateMouseAfterFn : function(option){
                if(option.type=="A"){
                    self.mouseNums+=1;
                }
                if(option.type=="B"){
                    self.landmineNums+=1;
                }
                self.mouseStatusArr[index].active=true;
                console.log("active---产生---"+true);
            },
            onGenerateMouseBeforeFn : function(){
                // 漏打地鼠超过数量，提示游戏结束
                if(self.mouseNums-self.beatNums>self.loseHitNums){
                    self.gameEnd("lose");
                }
            },
            onMouseClickFn : function(option){
                if(option.type=="A"){
                    if(self.playing){
                        self.score+=5;
                        self.beatNums+=1;
                        // 得分
                        self.scoreNode.innerHTML=self.score;
                    }
                }
                if(option.type=="B"){
                    self.gameEnd("landmine");
                }
                self.mouseClickCallback();
            },
            onRemoveMouseAfterFn : function(option){
                self.mouseStatusArr[index].active=false;
                mouseNode=null;
            }
        });
    },
    mouseClickCallback : function(){
        var self=this;
        if(self.score<=self.levelScoreArr[0]){
            self.mouseMoveUpTime=1000;
            self.mouseMoveDownTime=300;
            self.mouseGenerateTime=1500;
            self.level=1;
        }
        else if(self.score<=self.levelScoreArr[1]){
            self.mouseMoveUpTime=800;
            self.mouseMoveDownTime=300;
            self.mouseGenerateTime=800;
            self.level=2;
        }
        else if(self.score<=self.levelScoreArr[2]){
            self.mouseMoveUpTime=650;
            self.mouseMoveDownTime=280;
            self.mouseGenerateTime=500;
            self.level=3;
        }
        else if(self.score<=self.levelScoreArr[3]){
            self.mouseMoveUpTime=600;
            self.mouseMoveDownTime=250;
            self.mouseGenerateTime=350;
            self.level=4;
        }
        else if(self.score<=self.levelScoreArr[4]){
            self.mouseMoveUpTime=500;
            self.mouseMoveDownTime=150;
            self.mouseGenerateTime=200;
            self.level=5;
        }
        else if(self.score<=self.levelScoreArr[4]){
            self.mouseMoveUpTime=300;
            self.mouseMoveDownTime=120;
            self.mouseGenerateTime=150;
            self.level=6;
        }
        else {
            self.mouseMoveUpTime=250;
            self.mouseMoveDownTime=100;
            self.mouseGenerateTime=100;
            self.level=7;
        }
    },
    gameEnd : function(endType){

        var self=this;
        // 游戏结束
        self.playing=false;

        WpAudio.stop("game_music_start");

        // 传递游戏结果给后台
        self.playGameEndRequest();

        window.clearInterval(self.mouseGenerateTimer);

        var houses=document.querySelector(".houses")
            , house=houses.querySelectorAll(".house");

        // 在测试的一些华为手机上不支持 坑爹
        /*
        alert("house---forEach--");
        house.forEach(function(dom,index){
            alert('forEach---'+index);
            try{
                dom.classList.remove("generate");
                dom.classList.remove("cry");
                dom.classList.remove("landmine");
                dom.classList.remove("hit");
            }catch(x){
            }
        })
        */

        for(var i=0,len=house.length;i<len;i++){
            var dom=house[i];
            try{
                dom.classList.remove("generate");
                dom.classList.remove("landmine");
                dom.classList.remove("hit");
            }catch(x){
            }
        }

        // 让洞里都填满地鼠
        houses.classList.add("all");

        var timer=window.setTimeout(function(){
            $(".house .mouse").css("top","15%");

            var _img="";

            // 漏打地鼠
            if(endType=="lose"){
                if(self.score>=self.degreeScoreArr[2] && self.score>self.maxGameScore){
                    _img="gameoverlose3yuan.png";
                }
                else if(self.score>=self.degreeScoreArr[1] && self.score>self.maxGameScore){
                    _img="gameoverlose2yuan.png";
                }else if(self.score>=self.degreeScoreArr[0] && self.score>self.maxGameScore){
                    _img="gameoverlose1yuan.png";
                }else{
                    _img="gameoverlose.png";
                }
            }
            // 打到地雷
            else if(endType=="landmine"){

                if(self.score>=self.degreeScoreArr[2] && self.score>self.maxGameScore){
                    _img="gameend3yuan.png";
                }
                else if(self.score>=self.degreeScoreArr[1] && self.score>self.maxGameScore){
                    _img="gameend2yuan.png";
                }else if(self.score>=self.degreeScoreArr[0] && self.score>self.maxGameScore){
                    _img="gameend1yuan.png";
                }else{
                    _img="gameend.png";
                }
            }
            else{
            }

            GztUtil.showDialog({
                type : "pureimg",
                img : _img,
                btnOkFn : function(){
                    if(self.todayAlreadyPlayNums>=self.maxDayPlayNums){
                        self.allPlayEndTips();
                    }else{
                        self.gameReset();
                    }
                }
            })
            window.clearTimeout(timer);
        },self.mouseGenerateTime)
    },
    playGameEndRequest : function(){

        var self=this;
        $.ajax({
            type : "post",
            url : urlconfig.insertPlayData,
            data : {
                integral :  self.score,
                userid : self.username
            },
            success : function(res){

                var data=JSON.parse(res);
                if(data && data.status==0){
                    //console.log("上传游戏分数成功！");
                }else{
                    //console.log("上传游戏分数失败！");
                }
            },
            error : function(){
                //console.log("上传游戏分数失败！");
            }
        })
    },
    // 当天玩了十轮游戏结束后提示
    allPlayEndTips : function(){
        var self=this
          , time=self.mouseMoveUpTime+self.mouseMoveDownTime;
        var timer=window.setTimeout(function(){
            window.clearTimeout(timer);
            document.querySelector(".houses li:nth-of-type(2) .td:nth-of-type(2) .house").classList.add("p1");
            document.querySelector(".houses li:nth-of-type(3) .td:nth-of-type(2) .house").classList.add("p2");
        },time)
        self.overTenPlayTips();
    },
    // 加载时当天玩了超过10次提示
    overTenPlayTips : function(){
        var self=this
          , time=self.mouseMoveUpTime+self.mouseMoveDownTime
          , houses=document.querySelector(".houses")
          , house=houses.querySelectorAll(".house");

        houses.classList.add("all");

        var timer=window.setTimeout(function(){
            GztUtil.showDialog({
                type : "img",
                img : "endtime.png",
                btnOkFn : function(){
                    //historyBack();
                }
            })
           window.clearTimeout(timer);
        },time)
    }
}

// 加载音乐资源
initAudioResources();

$(function(){
    Game.init();
})
