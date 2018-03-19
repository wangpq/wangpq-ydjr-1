(function(window,document,undefined){
    window.params={
        starImg :"../images/star.png"
    }
})(window,document)

/*!
 * index.js version: v1.0.0; author : Wangpq;
 * Date: 2017-12-08T17:00Z
 */
/********** 游戏对象 **********/
var page7_timer;
var App={
    renderPage : function(index){
        $(".wAni").each(function(index,dom){
            var node=$(dom);
            node.removeClass(node.attr("data-animate")).css("visibility","hidden");
        })

        $(".page"+index+" .wAni").each(function(i,dom){
            var node=$(dom);
            var timer=window.setTimeout(function(){
                var dataAnimate=node.attr("data-animate");
                if(dataAnimate){
                    node.addClass(dataAnimate).css("visibility","visible");
                }else{
                    node.css("visibility","visible");
                }
                window.clearTimeout(timer);
            },parseInt(node.attr("data-delay")))
        })

        if(index==1 || index==3){
            var node=$(".page2 .progress-bar");
            node.css("width","0%");
        }
        if(index==9 || index==11){
            document.getElementById("page_10_canvas").getContext("2d").clearRect(0,0,window.innerWidth,window.innerHeight);
        }

        if(index==6 || index==8){
            window.clearInterval(page7_timer);
        }
        this["page_"+String(index)]();
    },
    page_1 : function(){
        //$(".page1 .foot").html(GztUtil.getTodayDate());
    },
    page_2 : function(){

        var node=$(".page2 .body .p:first-of-type .num");
        var value=parseInt(node.attr("data-value"));
        GztUtil.animateNums(node,[value-1084,value],"0");

        var node=$(".page2 .progress-bar");
        var value=node.attr("data-value");
        node.css("width",value+"%");

        var winWidth=window.innerWidth
          , winHeight=window.innerHeight
          , canvas = document.getElementById("page_2_canvas");
        function init(){
            $(canvas).attr({
                "width":winWidth,
                "height" : winHeight
            });
            draw();
        }
        function draw() {
            var context = canvas.getContext("2d");
            context.globalCompositeOperation = 'destination-over';
            context.clearRect(0,0,winWidth,winHeight);

            context.strokeStyle = "#121e30";
            context.lineWidth = "2";
            context.beginPath();
            context.arc(0,1*winHeight/10,5*winWidth/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.arc(0,1*winHeight/10,9.5*winWidth/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();
        }
        init();
    },
    page_3 : function(){

        var self=this;

        var node=$("#manPercent");
        var value=parseFloat(node.attr("data-value"));
        GztUtil.animateNums(node,[value-5.1,value],"1");

        var node1=$("#womenPercent");
        var value2=parseFloat(node1.attr("data-value"));
        GztUtil.animateNums(node1,[value2-5.1,value2],"1");

        //self.renderPage3Bar();

        var winWidth=window.innerWidth
          , winHeight=window.innerHeight
          , canvas = document.getElementById("page_3_canvas");
        function init(){
            $(canvas).attr({
                "width":winWidth,
                "height" : winHeight
            });
            draw();
        }
        function draw() {
            var context = canvas.getContext("2d");
            context.globalCompositeOperation = 'destination-over';
            context.clearRect(0,0,winHeight,winHeight);

            context.strokeStyle = "#121e30";
            context.lineWidth = "2";
            context.beginPath();
            context.arc(winWidth,2*winWidth/10,4*winWidth/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.arc(winWidth,2*winWidth/10,8.6*winWidth/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.arc(winWidth,2*winWidth/10,9.6*winHeight/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();
        }
        init();
    },
    renderPage3Bar : function(){
        var self=this;
        var data=[
                {
                    "total":0,
                    "name":"小于18"
                },
                {
                    "total":1,
                    "name":"18-22"
                },
                {
                    "total":7,
                    "name":"23-27"
                },
                {
                    "total":9,
                    "name":"28-32"
                },
                {
                    "total":8,
                    "name":"33-37"
                },
                {
                    "total":5,
                    "name":"38-42"
                },
                {
                    "total":6,
                    "name":"43-47"
                },
                {
                    "total":4,
                    "name":"48-52"
                },
                {
                    "total":3,
                    "name":"52-56"
                },
                {
                    "total":2,
                    "name":"56以上"
                }
            ]

        if(data && data.length>0){
            var xData=[],yData=[],arr=data;
            for(var i=0,l=arr.length;i<l;i++){
                /*
                xData.push(arr[i].name );
                yData.push(arr[i].total);
                */

                xData.push({
                    value : arr[i].name,
                    textStyle : {
                        fontSize :14
                    }
                });
                yData.push({
                    value : arr[i].total,
                    textStyle : {
                        fontSize : 14
                    }
                });
            }
            var option = {
                color: ['#2c3544'],
                textStyle : {
                    color:"#2c3544",
                    fontSize: 48,
                    fontWeight : "bold"
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '4%',
                    right: '5%',
                    top: '10%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis : [
                    {
                        //name :"年龄",
                        type : 'category',
                        data : xData,
                        axisLine :{
                            lineStyle : {
                                color: '#2c3544'
                            }
                        },
                        axisLabel : {
                            fontSize : 28
                        },
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisTick: {
                            show :false
                        }
                    }
                ],
                yAxis : [
                    {
                        //name :"用户率",
                        type : 'value',
                        data : yData,
                        axisLine :{
                            lineStyle : {
                                color: '#2c3544'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#4d4b5d',
                                type: 'dashed',
                            }
                        },
                        axisTick: {
                            show :false
                        }
                    }
                ],
                series : [
                    {
                        name : "值",
                        type:'bar',
                        barWidth: 'default',
                        barCategoryGap: '60%',
                        data:yData,
                        itemStyle: {
                            normal: {
                                barBorderRadius: 0,
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#157bad'},
                                        {offset: 1, color: '#213a61'}
                                    ]
                                )
                            }
                        }
                    }
                ]
            };
            GztUtil.renderChart("page3_bar",option);
        }
    },
    page_4 : function(){
        var winWidth=window.innerWidth
          , winHeight=window.innerHeight
          , canvas = document.getElementById("page_4_canvas");
        function init(){
            $(canvas).attr({
                "width":winWidth,
                "height" : winHeight
            });
            draw();
        }
        function draw() {
            var context = canvas.getContext("2d");
            context.globalCompositeOperation = 'destination-over';
            context.clearRect(0,0,winHeight,winHeight);

            context.strokeStyle = "#121e30";
            context.lineWidth = "2";
            context.beginPath();
            context.arc(4.5*winWidth/10,2*winWidth/10,2.2*winHeight/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.arc(4.5*winWidth/10,2*winWidth/10,4.8*winHeight/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.arc(4.5*winWidth/10,2*winWidth/10,8.4*winHeight/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();
        }
        init();
    },
    page_5 : function(){

        var node1=$("#page5_user_nums");
        var value1=parseFloat(node1.attr("data-value"));
        GztUtil.animateNums(node1,[value1-948,value1],"0");

        var node2=$("#page5_use_nums");
        var value2=parseFloat(node2.attr("data-value"));
        GztUtil.animateNums(node2,[value2-5325,value2],"0");

        var winWidth=window.innerWidth
          , winHeight=window.innerHeight
          , canvas = document.getElementById("page_5_canvas");
        function init(){
            $(canvas).attr({
                "width":winWidth,
                "height" : winHeight
            });
            draw();
        }
        function draw() {
            var context = canvas.getContext("2d");
            context.globalCompositeOperation = 'destination-over';
            context.clearRect(0,0,winHeight,winHeight);

            context.strokeStyle = "#121e30";
            context.lineWidth = "2";
            context.beginPath();
            context.arc(4.5*winWidth/10,1.5*winWidth/10,2.2*winHeight/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.arc(4.5*winWidth/10,2*winWidth/10,4.5*winHeight/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.arc(4.5*winWidth/10,2*winWidth/10,8.6*winHeight/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();
        }
        init();
    },
    page_6 : function(){

        var node1=$("#page6_pay_sum");
        var value1=parseFloat(node1.attr("data-value"));
        GztUtil.animateNums(node1,[value1-2248,value1],"0");

        var node2=$("#page6_consume_sum");
        var value2=parseFloat(node2.attr("data-value"));
        GztUtil.animateNums(node2,[value2-8432,value2],"0");


        var winWidth=window.innerWidth
          , winHeight=window.innerHeight
          , canvas = document.getElementById("page_6_canvas");
        function init(){
            $(canvas).attr({
                "width":winWidth,
                "height" : winHeight
            });
            draw();
        }
        function draw() {
            var context = canvas.getContext("2d");
            context.globalCompositeOperation = 'destination-over';
            context.clearRect(0,0,winHeight,winHeight);

            context.strokeStyle = "#121e30";
            context.lineWidth = "2";
            context.beginPath();
            context.arc(4.5*winWidth/10,1.5*winWidth/10,2.2*winHeight/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.arc(4.5*winWidth/10,2*winWidth/10,4.5*winHeight/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.arc(4.5*winWidth/10,2*winWidth/10,8.6*winHeight/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();
        }
        init();
    },
    page_7 : function(){

        (function(){
            var i=0;
            $(".page7 .foot img").eq(0).show()
            page7_timer=window.setInterval(function(){
                if(i<3){
                    i+=1;
                }else{
                    i=0 ;
                }
                $(".page7 .foot img").eq(i).show().siblings().hide();
            },1200)
        })()


        var winWidth=window.innerWidth
          , winHeight=window.innerHeight
          , canvas = document.getElementById("page_7_canvas");
            //创建新的图片对象
            var img = new Image();
            img.src = window.params.starImg;
            time=10;
        function init(){
            $(canvas).attr({
                "width":winWidth,
                "height" : winHeight
            });
            window.requestAnimationFrame(draw);
        }
        function draw() {
            time+=1;
            var context = canvas.getContext("2d");
            context.globalCompositeOperation = 'destination-over';
            context.clearRect(0,0,winHeight,winHeight);
            context.fillStyle = "#f00";
            context.strokeStyle = "#121e30";
            context.lineWidth = "2";
            context.beginPath();
            context.arc(12*winWidth/10,-1*winHeight/10,5*winWidth/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.arc(12*winWidth/10,-1*winHeight/10,13*winWidth/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();

        /*
            context.beginPath();
            context.arc(12*winWidth/10+winWidth*Math.sin(time),-1*winHeight/10+winWidth*Math.cos(time),20,0,2*Math.PI,false);
            context.closePath();
            context.fill();
              */

             /*
            var starNode=new Image();
            starNode.src=window.params.starImg;
            context.drawImage(starNode,12*winWidth/10+winWidth*Math.sin(time),-1*winHeight/10+winWidth*Math.cos(time),40,40);
           */
          window.requestAnimationFrame(draw);
        }
        init();
    },
    page_8 : function(){

        var winWidth=window.innerWidth
          , winHeight=window.innerHeight
          , canvas = document.getElementById("page_8_canvas");
        function init(){
            $(canvas).attr({
                "width":winWidth,
                "height" : winHeight
            });
            draw();
        }
        function draw() {
            var context = canvas.getContext("2d");
            context.globalCompositeOperation = 'destination-over';
            context.clearRect(0,0,winHeight,winHeight);

            context.strokeStyle = "#121e30";
            context.lineWidth = "2";
            context.beginPath();
            context.arc(0,1*winHeight/10,9.8*winHeight/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();
        }
        init();

    },
    page_9 : function(){

        var winWidth=window.innerWidth
          , winHeight=window.innerHeight
          , canvas = document.getElementById("page_9_canvas");

        function init(){
            $(canvas).attr({
                "width":winWidth,
                "height" : winHeight
            });
            draw();
        }
        function draw() {
            var context = canvas.getContext("2d");
            context.globalCompositeOperation = 'destination-over';
            context.clearRect(0,0,winHeight,winHeight);

            context.strokeStyle = "#121e30";
            context.lineWidth = "2";
            context.beginPath();
            context.arc(0,1*winHeight/10,5*winWidth/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.arc(0,1*winHeight/10,9.5*winWidth/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.arc(0,1*winHeight/10,9.8*winHeight/10,0,2*Math.PI,true);
            context.closePath();
            context.stroke();
        }
        init();
    },
    page_10_progress : function(){


        var progressArray=[
            {
                id : "bus_2018",
                bgColor : "#2b4570",
                stepColor : "#24bcff"
            },
            {
                id : "brt_2018",
                bgColor : "#2b4570",
                stepColor : "#aa4bff"
            },
            {
                id : "subway_2018",
                bgColor : "#2b4570",
                stepColor : "#1ceac0"
            },
            {
                id : "bus_2017",
                bgColor : "#2b4570",
                stepColor : "#24bcff"
            },
            {
                id : "brt_2017",
                bgColor : "#2b4570",
                stepColor : "#aa4bff"
            },
            {
                id : "bus_2016",
                bgColor : "#2b4570",
                stepColor : "#24bcff"
            }
        ]

        function autoProgressBar(i){
            var progressNode=$(".wpJdt").eq(i)
              , value=parseFloat( progressNode.attr("data-value"));
            new ProgressBar({
                node : document.getElementById(progressArray[i].id).querySelector("canvas"),
                lineWidth :8,
                value: value,
                bgColor : progressArray[i].bgColor,
                stepColor : progressArray[i].stepColor,
                fillColor : i==2 || i==4 ? "#0f1b2d" : "transparent",
                speed : 1,
                beforeStepFn : function(){
                    progressNode.find(".value>b").html(value);
                }
            });
        }

        $(".wpJdt>.canvas").each(function(index,dom){
            var node=$(dom);
            node.html('<canvas width="'+node.width()+'" height="'+node.height()+'" ></canvas>');
        })
        for(var i=0,len=progressArray.length;i<len;i++){
            autoProgressBar(i);
        }
    },
    page_10_canvas : function(){
        var winWidth=$(window).width()
          , winHeight=$(window).height()
          , canvas = document.getElementById("page_10_canvas");
        function init(){
            $(canvas).attr({
                "width":winWidth,
                "height" : winHeight
            });
            window.requestAnimationFrame(draw);
        }

        // 箭头线条的点(从下往上4个点)
        var pointsArr=[
            {
                x : 0,
                y : winHeight*9/10
            },
            {
                x : winWidth*1.8/10,
                y : 8*winHeight/10
            },
            {
                x : winWidth*5/10,
                y : 8*winHeight/10
            },
            {
                x : 10.6*winWidth/10,
                y : -0.5*winHeight/10
            }
        ]

        // 箭头线条的正切值(从下往上)
        var angleArr=[];
        angleArr.push( Math.abs( (pointsArr[1].y-pointsArr[0].y)/ (pointsArr[1].x-pointsArr[0].x) ) );
        angleArr.push( Math.abs( (pointsArr[3].y-pointsArr[2].y)/ (pointsArr[3].x-pointsArr[2].x) ) );


        var xStepValue=8,
            nowXValue=pointsArr[0].x,
            nowYValue=pointsArr[0].y;

        function draw() {
            var ctx = canvas.getContext("2d");

            var oldXValue=nowXValue ,
                oldYValue=nowYValue ;

			if(nowXValue <= pointsArr[1].x){
                nowXValue += xStepValue;
                nowYValue -= xStepValue* angleArr[0];
            }else if(nowXValue <= pointsArr[2].x){
                nowXValue += xStepValue;
                nowYValue = nowYValue;
            }else if(nowXValue < pointsArr[3].x){
                nowXValue += xStepValue;
                nowYValue -= xStepValue* angleArr[1];
            }else{
                //drawTriangle(ctx,pointsArr);   //填充
                return false;
            }

            ctx.lineWidth = 3;
            ctx.strokeStyle = "#24bcff";
            ctx.fillStyle = "#24bcff";

            drawLine(ctx,oldXValue,oldYValue,nowXValue,nowYValue);

            window.requestAnimationFrame(draw);
        }

        function drawTriangle(ctx,pointsArr){
            ctx.beginPath();
            ctx.moveTo(pointsArr[3].x-13,pointsArr[3].y+4);  //绘制起始点
            ctx.lineTo(pointsArr[3].x+13,pointsArr[3].y+14);
            ctx.lineTo(pointsArr[3].x+9,pointsArr[3].y-16);
            ctx.closePath();
            ctx.fill();   //填充
        }

        function drawLine(ctx,oldXValue,oldYValue,nowXValue,nowYValue){
            ctx.beginPath();
            ctx.moveTo(oldXValue,oldYValue);
            ctx.lineTo(nowXValue,nowYValue);
            ctx.closePath();
            ctx.stroke();
        }

        init();
    },
    page_10 : function(){
        this.page_10_progress();
        this.page_10_canvas();
    },
    page_11 : function(){
        var winWidth=$(window).width()
          , winHeight=$(window).height()
          , canvas = document.getElementById("page_11_canvas")
          , star_1=new Image();
        var arcOptions={
            x : winWidth/2,
            y : winHeight/2,
            r : 9*winHeight/20,
            sAngle : 0,
            eAngle : 2*Math.PI,
            counterclockwise : true,
        }
        var imgOptions={
            img : star_1,
            x : winWidth/2,
            y : 4*winHeight/20,
            width : 40,
            height : 40
        }
        function init(){
            star_1.src='../images/star.png';
            $(canvas).attr({
                "width":winWidth,
                "height" : winHeight
            });
            window.requestAnimationFrame(draw);
        }
        function draw() {
            var context = canvas.getContext("2d");
            context.globalCompositeOperation = 'destination-over';
            context.clearRect(0,0,winHeight,winHeight);

            context.strokeStyle = "#121e30";
            context.lineWidth = "2";
            context.beginPath();
            context.arc(arcOptions.x,arcOptions.y,arcOptions.r,arcOptions.sAngle,arcOptions.eAngle,arcOptions.counterclockwise);
            context.stroke();
            window.requestAnimationFrame(draw);
        }
        init();
    }

}




function audioPlay(appAudio){
    appAudio.play();
}

function audioPause(appAudio){
    appAudio.pause();
}

function audioInit(appAudio){
    appAudio.src="../audio/Freeflight.mp3";
    appAudio.preload="preload";
    appAudio.loop=true;
}

function audioControl(appAudio){
    var btnAudio=$(".btn-audio");

    btnAudio.unbind("touchstart").bind("touchstart",function(){
        if(appAudio.paused){
            appAudio.play();
            btnAudio.addClass("audioAnimate");
        }else{
            appAudio.pause();
            btnAudio.removeClass("audioAnimate");
        }
    })

    document.addEventListener("WeixinJSBridgeReady",function() {
        audioPlay(appAudio);
    },false);

    document.addEventListener('YixinJSBridgeReady',function() {
        audioPlay(appAudio);
    },false);
}

$(function(){

    PageSlider.case({
        startPage:1,
        range: 50,
        duration: 120,
        loop: false,
        elastic: true,
        translate3d: true,
        callback: function(index){
            App.renderPage(index);
        }
    });

    //var appAudio=document.createElement("AUDIO");
    //audioInit(appAudio);

    /*
    $(".btn-audio").addClass("audioAnimate");
    appAudio.autoplay="autoplay";
    audioPlay(appAudio);
    */

    //audioControl(appAudio);

})
