/*!
 * index.js version: v1.0.0; author : Wangpq;
 * Date: 2017-07-17T11:30Z
 */

function isInDistance( pbocDeviceSnANDdistance ){
    if(pbocDeviceSnANDdistance){
        var tempArr = pbocDeviceSnANDdistance.split("&&");
        localStorage.pbocDeviceSn = tempArr[0] ;
        localStorage.distance = tempArr[1];
        if(localStorage.pbocDeviceSn && localStorage.distance ){
            httpRequest("", urlConf.Device + "?mac=" + localStorage.pbocDeviceSn, DeviceCallback, 3);
        } else {
            toast("哪一项没有？pbocDeviceSn？"+localStorage.pbocDeviceSn+";distance？"+localStorage.distance);
        }
    }
}

/**
 * 根据设备号获取设备名称和限制距离，回调函数
 * localStorage.distance : 实际距离蓝牙设备的距离
 * obj.distance : 设置的最大限制距离
 */
function DeviceCallback(obj) {
    if (obj.status == "1" && obj.error && obj.error != "") {
        toast(obj.error);
    } else if (obj.status == "0") {
        if( parseFloat(localStorage.distance) < parseFloat(obj.distance) ){
            localStorage.deviceName = obj.deviceName;
            window.location.href = "./result.html";
        } else {
            toast("设备不在距离内");
        }
    }
}

/**
 * ios 扫一扫页面点击蓝牙列表调用函数
 */
function rightDistance(snAndName){
    if(snAndName){
        var tempArr = snAndName.split("&&");
        localStorage.pbocDeviceSn = tempArr[0] ;
        localStorage.deviceName = tempArr[1];
        window.location.href = "./result.html";
    }
}

/**
 * 安卓扫一扫页面点击外勤按钮调用函数
 */
function setWaiqin(){
    window.location.href="./legwork.html"
}


var app={
    init : function(){
        this._init();
        this.render();
        this.controls();
    },
    _init : function(){
        //this.workStatus = ["", "签到正常" , "缺勤" , "迟到" , "早退","非带薪请假","带薪请假","外勤"];
        this.workStatus = ["", '<span class="success">签到正常</span>' , '<span class="danger">缺勤</span>','<span class="danger">迟到</span>' , '<span class="danger">早退</span>','<span class="txt">请假</span><span class="r">扣钱</span>','<span class="txt">请假</span><span class="b">不扣钱</span>','<span class="link">外勤<span> ></span></span>'];
        this.workClass = [ "normal", "success" ,"danger", "danger","danger","normal","normal","link"];
        this.limitHourMinute="0930";
        this.nowHourMinute=this.getNowHourMinute();
    },
    render : function(){
        FastClick.attach(document.body);
        // 巡检提示
        this.initInspectTips();

        this.initHeadBack();
        this.initTable();
        this.initTableSignIn();
    },
    /**
     * 事件处理控制器
     */
    controls : function(){
        var self=this;

        document.querySelector("header .back").addEventListener('click', function() {
            self.historyBack();
        }, false);

        self.drcal.delegate('td', 'click', function () {
            self.drcal.find('td').removeClass('selected');
            var _this= $(this);
            _this.addClass('selected');
            self.selectDate(_this.attr("date"));
        });

        self.drcal.find(".prev").bind("click",function(){
            var startDate=self.drcal.find("tbody tr:first-of-type td").eq(0).attr("date");
            var endDate=self.drcal.find("tbody tr:last-of-type td:last-of-type").attr("date");
            self.getAllSignInList(startDate,endDate);
        })

        self.drcal.find(".next").bind("click",function(){
            var startDate=self.drcal.find("tbody tr:first-of-type td").eq(0).attr("date");
            var endDate=self.drcal.find("tbody tr:last-of-type td:last-of-type").attr("date");
            self.getAllSignInList(startDate,endDate);
        })

        /*
        list-view通过AJAX的值渲染的，放这里获取不到
        $(".list-view li>.btn span").unbind("click").bind("click",function(){
            self.signInClick();
        })
        */
    },
    initInspectTips : function(){
        var self=this;
        new ajax({
            type : "get",
            url:urlConf.findArrange,
            data:{
                /*
              userId : "9e450f8a8e0549ad9535f6ec30ecf159",
              cmpId : "1"
                */
              cmpId : localStorage.pbocUserCmpId,
              userId : localStorage.pbocUserId
            },
            success : function(data){
                self.renderInspectTips(data);
            },
            error: function(data){
            }
        })

        /*
        var data={
            "status":"0",
            "signinTimesByDay":0,
            "toDayDate" : 1511193602000,
            "arrange":{
                    "pbocArrangeId":"ce82027e6bc7451fb60419224a0ab0f3",
                    "pbocArrangeStartTime":1511193802000,
                    "pbocArrangeEndTime":1511193902000,
                    "pbocArrangeUser":"b8d19348d7264e2995c4e12b07251c94",
                    "pbocArrangeUserId":null,
                    "pbocArrangeCreateTime":1510890342000,
                    "pbocArrangeStatus":0,
                    "pbocArrangeCmpId":"c19bf9c2f38a446fb9dd6314399f9abf",
                    "reserve1":null,
                    "reserve2":null,
                    "reserve3":null,
                    "reserve4":null,
                    "reserve5":null,
                    "reserve6":null,
                    "reserve7":null,
                    "reserve8":null,
                    "reserve9":null
            },
            "arrangeIng":{
                    "pbocArrangeId":"ac306adae46b42ba85dcb208abaf9acc",
                    "pbocArrangeStartTime":1511193601000,
                    "pbocArrangeEndTime":1511193624000,
                    "pbocArrangeUser":"b8d19348d7264e2995c4e12b07251c94",
                    "pbocArrangeUserId":null,
                    "pbocArrangeCreateTime":1510889765000,
                    "pbocArrangeStatus":0,
                    "pbocArrangeCmpId":"c19bf9c2f38a446fb9dd6314399f9abf",
                    "reserve1":null,
                    "reserve2":null,
                    "reserve3":null,
                    "reserve4":null,
                    "reserve5":null,
                    "reserve6":null,
                    "reserve7":null,
                    "reserve8":null,
                    "reserve9":null
            }
        }
        self.renderInspectTips(data);
        */
    },
    renderInspectTips : function(data){
        // arrangeIng : 今天需要巡检,巡检至X日。
        // arrange : X天后XX日开始巡检，请做好准备
        if(data){
            var nowTime=parseInt(data.toDayDate) || new Date().getTime();
            //正在巡检 + 将来N天有巡检
            if(data.arrangeIng && data.arrange){
                var startTime1=parseInt(data.arrangeIng.pbocArrangeStartTime),
                    endTime1=parseInt(data.arrangeIng.pbocArrangeEndTime),
                    _endTime1=GztUtil.formatTimeToYearMonthDate(endTime1);

                var startTime2=parseInt(data.arrange.pbocArrangeStartTime),
                _startTime2=GztUtil.formatTimeToYearMonthDate(startTime2),
                nDay=(startTime2-nowTime)/(24*3600*1000);

                if(nowTime>=startTime1 && nowTime<(endTime1+24*3600*1000) && nowTime<startTime2){
                    if(nDay>1){
                        nDay=String( Math.ceil(nDay) ) +"天后";
                    }else if(nDay<1){
                        nDay="明天";
                    }
                    GztUtil.wpDialogConfirm({
                        title : "温馨小助手",
                        text : '今天需要巡检,巡检至'+_endTime1+'日结束。<br>'+nDay+_startTime2+'日开始巡检，请做好准备！',
                        btnOkText : '我知道了',
                        beforeShowFn : function(){
                        },
                        okFn : function(){
                            GztUtil.dialogClose();
                        }
                    })
                }
            }
            // 将来N天有巡检
            else if(data.arrange){
                var startTime=parseInt(data.arrange.pbocArrangeStartTime),
                    _startTime=GztUtil.formatTimeToYearMonthDate(startTime),
                    nDay=(startTime-nowTime)/(24*3600*1000);
                if(nowTime<startTime){
                    if(nDay>1){
                        nDay=String( Math.ceil(nDay) ) +"天后";
                    }else if(nDay<1){
                        nDay="明天";
                    }
                    GztUtil.wpDialogConfirm({
                        title : "温馨小助手",
                        text : nDay+_startTime+'日开始巡检，请做好准备！',
                        btnOkText : '我知道了',
                        beforeShowFn : function(){
                        },
                        okFn : function(){
                            GztUtil.dialogClose();
                        }
                    })
                }
            }
            // 正在巡检
            else if(data.arrangeIng){
                var startTime=parseInt(data.arrangeIng.pbocArrangeStartTime),
                    endTime=parseInt(data.arrangeIng.pbocArrangeEndTime),
                    _endTime=GztUtil.formatTimeToYearMonthDate(endTime);
                if(nowTime>=startTime && nowTime<(endTime+24*3600*1000)){
                    GztUtil.wpDialogConfirm({
                        title : "温馨小助手",
                        text : '今天需要巡检,巡检至'+_endTime+'日。',
                        btnOkText : '我知道了',
                        beforeShowFn : function(){
                        },
                        okFn : function(){
                            GztUtil.dialogClose();
                        }
                    })
                }
            }
            // 这几天都没有巡检
            else{
            }
        }
    },
    initHeadBack : function(){
        if(localStorage.app && localStorage.app=="cloudsignin"){
             document.querySelector("header a.back").style.display="none";
        }
    },
    getToday : function(){
        var date=new Date()
          , year=date.getFullYear()
          , month=date.getMonth()+1
          , day =date.getDate()
       month= month<10 ? "0"+String(month) : month;
       day= day<10 ? "0"+String(day) : day;
       return String(year)+"-"+String(month)+"-"+String(day);
    },
    getNowHourMinute : function(){
        var date=new Date()
          , hour=date.getHours()
          , minute=date.getMinutes();
        hour= hour<10 ? "0"+String(hour) : String(hour);
        minute= minute<10 ? "0"+String(minute) : String(minute);
        return hour + minute;
    },
    initTable: function(){
        this.drcal = $.drcal();
        this.drcal.changeMonth(new Date());
        $("#wpDate").html(this.drcal);
        this.startDate=this.drcal.find("td").eq(0).attr("date");
        this.today=this.getToday();
    },
    getAllSignInList : function(startDate,endDate){
        if(this.today>startDate && this.today<endDate){
            $(".list-view li .btn span").show();
        }else {
            $(".list-view li .btn span").hide();
        }
        this.loopSignInTable(startDate,endDate);
    },
    /**
     * 签到事件
     */
    signInClick : function(me){
        var self=this
          , index=me.parents("li").index()
          , signType;
        if(self.showCounts==1){
             signType= (index==0) ? 1 : 4 ;
        }
        if(self.showCounts==2){
            signType=index+1;
        }
        localStorage.setItem("signType",signType);
        if( localStorage.platform == "ios") {
            var scanString="cloudSignInScan&外勤&setWaiqin&"+localStorage.pbocUserCmpId+"&rightDistance&";
            //如果人行
            if(localStorage.pbocCmpMark=="1")
                window.WebViewBridge.send(scanString+'0'+"&1&"+localStorage.pbocUserId);
            else
                window.WebViewBridge.send(scanString+'1'+"&1&"+localStorage.pbocUserId);
        } else {
            // 第三个参数：a代表签到，b代表巡检
            window.CloudSign.callCarpture(localStorage.pbocCmpMark,localStorage.pbocUserCmpId,"a",localStorage.pbocUserId);
        }
    },
    /**
     * 获取员工每日需签到次数
     * 根据次数渲染下方列表视图
     * 并且赋值
     */
    getSignInCountsAndRender :function(){
        var self=this;
        /*
        new ajax({
            type : "POST",
            data : {
                userId : localStorage.pbocUserId
            },
            url:urlConf.signinTimesByDay,
            success : function(data){
                self.renderListView(data);
            }
        })
        */
        httpRequest("",urlConf.signinTimesByDay+"?userId="+localStorage.pbocUserId,this.renderListView,3)
    },
    /**
     * 根据员工每日签到次数初始化列表
     */
    renderListView : function(data){
        var self=app;
        if(data.status=="0" && data.signinTimesByDay!==""){
            self.showCounts=parseInt(data.signinTimesByDay)/2;
            var tpl="";
            if(self.showCounts==1){
                tpl+=
                '<li>'+
                    '<div class="name">上班1</div>'+
                    '<div class="time"></div>'+
                    '<div class="value"></div>'+
                    '<div class="btn"><span>签到</span></div>'+
                '</li>'+
                '<li>'+
                    '<div class="name">下班2</div>'+
                    '<div class="time"></div>'+
                    '<div class="value"></div>'+
                    '<div class="btn"><span>签到</span></div>'+
                '</li>';
            }
            if(self.showCounts==2){
                for(var i=0,l=self.showCounts;i<l;i++){
                    tpl+=
                    '<li>'+
                        '<div class="name">上班'+(i+1)+'</div>'+
                        '<div class="time"></div>'+
                        '<div class="value"></div>'+
                        '<div class="btn"><span>签到</span></div>'+
                    '</li>'+
                    '<li>'+
                        '<div class="name">下班'+(i+1)+'</div>'+
                        '<div class="time"></div>'+
                        '<div class="value"></div>'+
                        '<div class="btn"><span>签到</span></div>'+
                    '</li>';
                }
            }
            if(self.showCounts>2){
                toast("设置打卡次数不正确！")
                return false;
            }
            $(".list-view").html(tpl);

            /**
             * 调用获取当天的签到记录
             */
            self.selectDate(self.today);
        }else{
            if(data.status=="1" && data.error!=="" ){
                toast(data.error);
            }else{
                toast("获取员工每日签到次数接口出错啦!");
            }
        }
    },
    /**
     * 请求指定时间段内的签到AJAX
     */
    loopSignInTable : function(startDate,endDate){
        var self=this;
        new ajax({
            type: "post",
			url:urlConf.GetAllRecords,
            data:{
                userid : localStorage.pbocUserId,
                startTime : startDate,
                endTime : endDate
            },
            success : function(data){
                self.getAllRecordsCallback(data);
            }
        })
    },
    /**
     * 处理指定时间段内的签到AJAX数据
     */
    getAllRecordsCallback : function(data){
        var self=this;
        if(data.status=="0" && data.signInRecords){
            self.renderLoopSignInTable(data.signInRecords);
        }else{
            toast(data.error ? data.error : "获取指定时间段内签到记录失败啦!");
        }
    },
    /**
     * 根据指定时间段内的签到AJAX数据渲染日历表格
     */
    renderLoopSignInTable : function(arr){
        var self=this;
        // 初始化签到日期表格
        arr.forEach(function(dom,index){
           var date=dom.signindate
             , flag=false
             , classType="";
           if(self.showCounts==1){
               flag=(dom.signinstate1 && (dom.signinstate1==1 || dom.signinstate1==7) )
                  && (dom.signinstate4 && (dom.signinstate4==1 || dom.signinstate4==7) )
           }else if(self.showCounts==2){
               flag=(dom.signinstate1 && (dom.signinstate1==1 || dom.signinstate1==7) )
                  && (dom.signinstate2 && (dom.signinstate2==1 || dom.signinstate2==7) )
                  && (dom.signinstate3 && (dom.signinstate3==1 || dom.signinstate3==7) )
                  && (dom.signinstate4 && (dom.signinstate4==1 || dom.signinstate4==7) )
           }else{
           }
           if(self.today==date){
               classType= flag ? "success" : "";
           }else{
               classType= flag ? "success" : "danger";
           }
           document.querySelector('[date="'+date+'"]').classList.add(classType);
        })
    },
    initTableSignIn : function(){
        document.querySelector('[date="'+this.today+'"]').classList.add("selected");
        this.getSignInCountsAndRender();
    },
    /**
     * 清空签到记录列表
     */
    emptyListviewVulue : function(){
        if(this.queryDate<this.today){
            $(".list-view li .btn span").hide();
        }
        $(".list-view li .time").html("");
        $(".list-view li .value").html("");
    },
    /**
     * 请求选中日期的签到AJAX
     */
    selectDate : function(date){
        var self=this;
        self.queryDate=date;

        if(self.today<date){
            toast("查询时间超过了当前日期");
            return false;
        }

        new ajax({
            type : "post",
			url:urlConf.GetSigninRecord,
            data:{
                userid : localStorage.pbocUserId,
                signindate : date
            },
            success : function(data){
                self.getSignInRecordCallback(data);
            }
        })


        /*
        var data={
            userid : localStorage.pbocUserId,
            signindate : date
        };
        httpRequest(JSON.stringify(data), urlConf.GetSigninRecord, self.getSignInRecordCallback, 3);
        */
    },
    /**
     * 渲染选中日期的签到AJAX数据
     */
    getSignInRecordCallback : function(data){
        var self=this;
        self.emptyListviewVulue();
        if(data.status=="0"){
            if(self.queryDate==self.today){
                $(".list-view").show();
                $(".list-view li .btn span").show();
            }
            if(data.signInRecord){
                $(".list-view").show();
                if(self.showCounts==1){
                    if(data.signInRecord.signinstate1 && data.signInRecord.signinstate1!==""){
                        var time=data.signInRecord.signintime1;
                        var displayStr=(self.queryDate==self.today && (data.signInRecord.signinstate1==5 || data.signInRecord.signinstate1==6) && !time) ? "inline-block" : "none";
                        document.querySelector(".list-view li:nth-of-type(1) .time").innerHTML=time ? time.substr(11,5) : "";
                        document.querySelector(".list-view li:nth-of-type(1) .btn span").style.display=displayStr;
                        document.querySelector(".list-view li:nth-of-type(1) .value").innerHTML=self.workStatus[data.signInRecord.signinstate1] ;
                    }
                    if(data.signInRecord.signinstate4 && data.signInRecord.signinstate4!==""){
                        var time=data.signInRecord.signintime4;
                        var displayStr=self.queryDate==self.today ? "inline-block" : "none";
                        document.querySelector(".list-view li:nth-of-type(2) .time").innerHTML=time ? time.substr(11,5) : "";
                        document.querySelector(".list-view li:nth-of-type(2) .btn span").style.display=displayStr;
                        document.querySelector(".list-view li:nth-of-type(2) .value").innerHTML=self.workStatus[data.signInRecord.signinstate4] ;

                        if(self.queryDate==self.today && (data.signInRecord.signinstate4==5 || data.signInRecord.signinstate4==6) && !time  ){
                            document.querySelector(".list-view li:nth-of-type(1) .btn span").style.display="block";
                        }else{
                            document.querySelector(".list-view li:nth-of-type(1) .btn span").style.display="none";
                        }

                        // 下班2有数据，上班1没有签到数据时候，上班1签到按钮可见
                        if(self.queryDate==self.today && !data.signInRecord.signinstate1){
                            document.querySelector(".list-view li:nth-of-type(1) .btn span").style.display="inline-block";
                        }
                    }

                    if( self.queryDate==self.today && parseInt(self.nowHourMinute) < parseInt(self.limitHourMinute)){
                        document.querySelector(".list-view li:nth-of-type(2) .btn span").style.display="none";
                    }

                }else if(self.showCounts==2){
                    if(data.signInRecord.signinstate1 && data.signInRecord.signinstate1!==""){
                        var time=data.signInRecord.signintime1;
                        var displayStr=(self.queryDate==self.today && (data.signInRecord.signinstate1==5 || data.signInRecord.signinstate1==6) && !time) ? "inline-block" : "none";
                        document.querySelector(".list-view li:nth-of-type(1) .time").innerHTML=time ? time.substr(11,5) : "";
                        document.querySelector(".list-view li:nth-of-type(1) .btn span").style.display=displayStr;
                        document.querySelector(".list-view li:nth-of-type(1) .value").innerHTML=self.workStatus[data.signInRecord.signinstate1] ;
                    }
                    if(data.signInRecord.signinstate2 && data.signInRecord.signinstate2!==""){
                        var time=data.signInRecord.signintime2;
                        var displayStr=self.queryDate==self.today ? "inline-block" : "none";
                        document.querySelector(".list-view li:nth-of-type(2) .time").innerHTML=time ? time.substr(11,5) : "";
                        document.querySelector(".list-view li:nth-of-type(2) .btn span").style.display=displayStr;
                        document.querySelector(".list-view li:nth-of-type(2) .value").innerHTML=self.workStatus[data.signInRecord.signinstate2] ;
                        if(displayStr!=="none"){
                            document.querySelector(".list-view li:nth-of-type(1) .btn span").style.display="none";
                        }
                        // 下班1有数据，上班1没有签到数据时候，上班1签到按钮可见
                        if(self.queryDate==self.today && !data.signInRecord.signinstate1){
                            document.querySelector(".list-view li:nth-of-type(1) .btn span").style.display="inline-block";
                        }
                    }
                    if(data.signInRecord.signinstate3 && data.signInRecord.signinstate3!==""){
                        var time=data.signInRecord.signintime3;
                        var displayStr=(self.queryDate==self.today && (data.signInRecord.signinstate3==5 || data.signInRecord.signinstate3==6) && !time ) ? "inline-block" : "none";
                        document.querySelector(".list-view li:nth-of-type(3) .time").innerHTML=time ? time.substr(11,5) : "";
                        document.querySelector(".list-view li:nth-of-type(3) .btn span").style.display=displayStr;
                        vue=document.querySelector(".list-view li:nth-of-type(3) .value").innerHTML=self.workStatus[data.signInRecord.signinstate3] ;

                        if(self.queryDate==self.today && (data.signInRecord.signinstate3==5 || data.signInRecord.signinstate4==3) && !time  ){
                            document.querySelector(".list-view li:nth-of-type(2) .btn span").style.display="block";
                        }else{
                            document.querySelector(".list-view li:nth-of-type(2) .btn span").style.display="none";
                        }
                    }
                    if(data.signInRecord.signinstate4 && data.signInRecord.signinstate4!==""){
                        var time=data.signInRecord.signintime4;
                        var displayStr=self.queryDate==self.today ? "inline-block" : "none";
                        document.querySelector(".list-view li:nth-of-type(4) .time").innerHTML=time ? time.substr(11,5) : "";
                        document.querySelector(".list-view li:nth-of-type(4) .btn span").style.display=displayStr;
                        document.querySelector(".list-view li:nth-of-type(4) .value").innerHTML=self.workStatus[data.signInRecord.signinstate4] ;
                        if(displayStr!=="none"){
                            document.querySelector(".list-view li:nth-of-type(3) .btn span").style.display="none";
                        }
                        // 下班2有数据，上班2没有签到数据时候，上班2签到按钮可见
                        if(self.queryDate==self.today && !data.signInRecord.signinstate3){
                            document.querySelector(".list-view li:nth-of-type(3) .btn span").style.display="inline-block";
                        }
                    }
                }else{
                }
            }else{
                $(".list-view").show();
                if(self.showCounts==1){
                    if( self.queryDate==self.today && parseInt(self.nowHourMinute) < parseInt(self.limitHourMinute)){
                        document.querySelector(".list-view li:nth-of-type(2) .btn span").style.display="none";
                    }
                }
            }
        }else{
            toast("查询选定日期签到记录失败！")
        }

        /**
         * 绑定签到的点击事件
         */
        $(".list-view li>.btn span").unbind("click").bind("click",function(){
            self.signInClick($(this));
        })

        /**
         * 查看外勤的点击事件
         */
        $(".list-view li .value .link").unbind("click").bind("click",function(){
            var signType
              , curLi=$(this).parents("li")
              , index=curLi.index()
              , signindate =$(".calendar .selected").attr("date");
            if(self.showCounts==1){
                signType= index==0 ? 1 : 4;
            }
            if(self.showCounts==2){
                signType=index+1;
            }
            window.open('./legworkview.html?'+'signType='+signType+'&signindate='+signindate,'_self')
        })

        /**
         * 调用查询指定时间段内的签到记录
         */
        self.loopSignInTable(self.startDate,self.today)
    },
    /**
     * 返回并刷新
     * @method historyBack
     * @return {Null} 无返回值
     */
    historyBack :historyBack
}

app.init();
