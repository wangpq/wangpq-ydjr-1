/*!
 * inspect.js version: v1.0.0; author : Wangpq;
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
            toast("缺哪一项？pbocDeviceSn:"+localStorage.pbocDeviceSn+";distance:"+localStorage.distance);
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
        if( localStorage.distance < obj.distance ){
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
        this.render();
        this.controls();
    },
    render : function(){
        FastClick.attach(document.body);
        this.initHeadBack();
        this.initSelectDate(this.getToday());
        this.initInspectRecords();
    },
    controls : function(){
        var self=this;

        // 返回按钮
        document.querySelector("header .back").addEventListener('click', function() {
            self.historyBack();
        }, false);

        // 开始日期选择
        document.getElementById("start").addEventListener('change', function() {
             document.getElementById("week_1").innerHTML=self.getWeek(this.value);
             document.getElementById("startDate").innerHTML=this.value;
             self.startDate=this.value;
             self.clearListView();
             self.records.requestPage = 1; // 请求的页码
             self._isLoadingMore = true; // _isLoadingMore为true代表可以加载更多，false代表已经没有啦，到头啦
             self.getInspectRecords(self.startDate,self.endDate);
        }, false);

        // 结束日期选择
        document.getElementById("end").addEventListener('change', function() {
             document.getElementById("week_2").innerHTML=self.getWeek(this.value);
             document.getElementById("endDate").innerHTML=this.value;
             self.endDate=this.value;
             self.clearListView();
             self.records.requestPage = 1; // 请求的页码
             self._isLoadingMore = true; // _isLoadingMore为true代表可以加载更多，false代表已经没有啦，到头啦
             self.getInspectRecords(self.startDate,self.endDate);
        }, false);

        // 巡检
        document.getElementById("btn-inspect").addEventListener('click', function() {
            self.inspect();
        }, false);
    },
    initHeadBack : function(){
        if(localStorage.app && localStorage.app=="cloudsignin"){
             document.querySelector("header a.back").style.display="none";
        }
    },
    clearListView : function(){
        document.querySelector(".list-view").innerHTML='<li class="loadMoreRow"><div class="loadMore"></div></li>';
    },
    inspect : function(){
        if( localStorage.platform == "ios") {
            if(localStorage.pbocCmpMark=="1"){
                window.WebViewBridge.send("cloudSignInScan&&&"+localStorage.pbocUserCmpId+"&rightDistance&0&2&"+localStorage.pbocUserId);
            }
            else{
                window.WebViewBridge.send("cloudSignInScan&&&"+localStorage.pbocUserCmpId+"&rightDistance&1&2&"+localStorage.pbocUserId);
            }
        } else {
            // 第三个参数：a代表签到，b代表巡检
            window.CloudSign.callCarpture("1",localStorage.pbocUserCmpId,"b",localStorage.pbocUserId);
        }
    },
    initInspectRecords : function(){
        this.records = {};
        this.records.requestPage = 1; // 请求的页码
        this._isLoadingMore = true; // _isLoadingMore为true代表可以加载更多，false代表已经没有啦，到头啦
        this.totalPage = 1 ; //总页码
        this.getInspectRecords(this.startDate,this.endDate);
    },
    getInspectRecords : function(startDate,endDate){
        var data = {
            "pbocUserPhone":localStorage.pbocUserPhone,
            "pbocUserCode":localStorage.code ,
            "startDate": startDate,
            "endDate": endDate,
            "requestPage": this.records.requestPage,
            "page": 28
        };
        httpRequest(JSON.stringify(data), urlConf.GetInspectionRecords , this.getInspectionRecordsCallback , 3);
    },
    getInspectionRecordsCallback : function(data){
        var self=app;
        if ( data.status == "0" && data.totalPage != 0 ) {
            // 记录总页数
            self.totalPage = data.totalPage;
            // 追加内容
            self.appendRecords(data.inspections);

        }else if( data.status == "1" && data.error && data.error != "" ){
            toast( data.error );
        }
        document.querySelector(".list-view").addEventListener('scroll', function() {
            self.onscrollEvent();
        }, false);
    },
    // 注册页面滚动事件
    onscrollEvent : function(){
        if(!this._isLoadingMore){
            return false;
        }
        // 这里的2为微调值
        if (this.getScrollTop() + this.getClientHeight()+2 >= this.getScrollHeight() ) {
            this.records.requestPage = this.totalPage == 1 ? 1 : (this.records.requestPage + 1);
            this.records.requestPage > this.totalPage ?  this._isLoadingMore = false : null;
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
        if ( this.records.requestPage == 1 || !this._isLoadingMore) {
            document.querySelector(".list-view .loadMore").innerHTML="已加载全部";
        } else {
            document.querySelector(".list-view .loadMore").innerHTML="<i></i><span>正在加载更多...</span>";
            this.getInspectRecords(this.startDate,this.endDate);
        }
    },
    appendRecords : function(records){
        var childNum = $(".list-view").children().length;
        if( childNum == 1 ){
            $(".list-view").prepend(this.dataToView(records));
        } else if( childNum > 1 ){
            $(".list-view li:nth-last-child(2)").after(this.dataToView(records));
        }
    },
    dataToView : function(arr){
        var tpl="";
        arr.forEach(function(dom,index){
            tpl+=
            '<li class="row">'+
                '<span class="text">' + dom.pbocDeviceName+ '</span>'+
                '<span class="date">' + dom.pbocInspectionTime+ '</span>'+
            '</li>';
        })
        return tpl;
    },
    initSelectDate : function(today){
        var startDate=today.substr(0,8)+"01";
        this.startDate=startDate;
        this.today=today;
        this.endDate=today;
        document.getElementById("start").value=startDate;
        document.getElementById("week_1").innerHTML=this.getWeek(startDate);
        document.getElementById("startDate").innerHTML=startDate;
        document.getElementById("end").value=today;
        document.getElementById("week_2").innerHTML=this.getWeek(today);
        document.getElementById("endDate").innerHTML=today;
    },
    /**
     * 根据年月日计算星期几
     * @method getWeek
     * @param {str} String 格式如"2016-06-21"的日期字符串
     * @return {String} 返回星期几
     *
     *
        w：星期； w对7取模得：0-星期日，1-星期一，2-星期二，3-星期三，4-星期四，5-星期五，6-星期六
        c：世纪-1（前两位数）
        y：年（后两位数）
        m：月（m大于等于3，小于等于14，即在蔡勒公式中，某年的1、2月要看作上一年的13、14月来计算，比如2003年1月1日要看作2002年的13月1日来计算）
        d：日  [ ]代表取整，即只要整数部分。

        例子1：
        2013年3月7日，过程如下：
        w=y+[y/4]+[c/4]-2c+[26(m+1)/10]+d-1
        =13+[13/4]+[20/4]-2*20+[26*(3+1)/10]+7-1
        =-3 (除以7余4，注意对负数的取模运算！)
        即2013年3月7日是星期四。

        例子2：
        2049年10月1日
        w=y+[y/4]+[c/4]-2c+[26(m+1)/10]+d-1
        =49+[49/4]+[20/4]-2×20+[26×(10+1)/10]+1-1
        =49+[12.25]+5-40+[28.6]
        =49+12+5-40+28
        =54 (除以7余5)
        即2049年10月1日是星期五。
     *
     *
     *
     */
    getWeek : function(str){
        var getFuNumYu=function(num){
            var k=num;
            while(k<0){
            k=k+7
            }
            return k;
        }
        var arr=["周日","周一","周二","周三","周四","周五","周六"];
        var w
          , k=parseInt( str.substr(5,2) )
          , y=parseInt( str.substr(2,2) )
          , c=parseInt( str.substr(0,2) )
          , m= k > 2 ? k : k+12
          , d=parseInt( str.substr(8,2) );
        w=y+parseInt(y/4)+parseInt(c/4)-2*c+parseInt(26*(m+1)/10)+d-1;
        if(w>0){
           w=w%7;
        }else{
           w=getFuNumYu(w);
        }
        return arr[w];
    },
    getToday : function(){
        var date=new Date()
          , year=date.getFullYear()
          , month=date.getMonth()+1
          , day =date.getDate()
       month= month<10 ? "0"+String(month) : month;
       day= day<10 ? "0"+String(day) : day;
       return year+"-"+month+"-"+day;
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
    historyBack :  historyBack
}

app.init();
