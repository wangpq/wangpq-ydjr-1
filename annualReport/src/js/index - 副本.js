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
var App={
    init : function(){
        this._init();
        this.render();
        this.controls();
    },
    _init : function(){
        
    },
    render : function(){
        var self=this;

    },
    controls : function(){
  
    },
    renderPage : function(index){
        $(".wAni").each(function(index,dom){
            var node=$(dom);
            node.removeClass(node.attr("data-animate")).css("visibility","hidden");
        })

        $(".page"+index+" .wAni").each(function(i,dom){
            var node=$(dom);
            var timer=window.setTimeout(function(){
                if(node.attr("data-animate")!==""){
                    node.addClass(node.attr("data-animate")).css("visibility","visible");
                }else{
                    node.css("visibility","visible"); 
                }
                window.clearTimeout(timer);
            },parseInt(node.attr("data-delay")))   
        })
        for(var i=1,len=12;i<len;i++){
            try {
                if(index!==2){
                    var node=$(".page2 .progress-bar");
                    node.css("width","0%"); 
                }
                this["page_"+String(index)]();   
            } catch (error) { 
            }
        }
    },
    page_1 : function(){

    },
    page_2 : function(){
        
        var node=$(".page2 .body p:first-of-type .num");
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
        }
        init();
    },
    page_3 : function(){

        var self=this;

        var node=$("#manPercent");
        var value=node.attr("data-value");
        GztUtil.animateNums(node,[value-5.1,value],"1");

        var node1=$("#womenPercent");
        var value2=node.attr("data-value");
        GztUtil.animateNums(node1,[value2-5.1,value2],"1");

        self.renderPage3Bar();

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
        var data={
            "version":"1.0.0",
            "status":"success",
            "errmsg":null,
            "obj":null,
            "total":0,
            "rate":null,
            "trade":[
                {
                    "total":22,
                    "name":"12"
                },
                {
                    "total":33,
                    "name":"14"
                },
                {
                    "total":24,
                    "name":"16"
                },
                {
                    "total":38,
                    "name":"18"
                },
                {
                    "total":40,
                    "name":"20"
                },
                {
                    "total":78,
                    "name":"22"
                },
                {
                    "total":60,
                    "name":"24"
                },
                {
                    "total":70,
                    "name":"26"
                },
                {
                    "total":58,
                    "name":"28"
                },
                {
                    "total":46,
                    "name":"30"
                },
                {
                    "total":38,
                    "name":"32"
                },
                {
                    "total":70,
                    "name":"34"
                },
                {
                    "total":60,
                    "name":"36"
                }
            ],
            "stats":null
        }

        if(data.status==="success" && data.trade.length>0){
            var xData=[],yData=[],arr=data.trade;
            for(var i=0,l=arr.length;i<l;i++){
                xData.push(arr[i].name.length>4? arr[i].name.substr(0,4) : arr[i].name );
                yData.push(arr[i].total);
            }
            var option = {
                color: ['#2c3544'],
                textStyle : {
                    color:"#2c3544",
                    fontSize: 18,
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
                    right: '4%',
                    top: '6%',
                    bottom: '1%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : xData,
                        axisLine :{
                            lineStyle : {
                                color: '#2c3544'
                            }
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
                        type : 'value',
                        axisLine :{
                            lineStyle : {
                                color: '#2c3544'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#4d4b5d',
                                type: 'dashed'
                            }
                        },
                        axisTick: {
                            show :false
                        }
                    }
                ],
                series : [
                    {
                        name : "交易笔数",
                        type:'bar',
                        barWidth: '20',
                        data:yData,
                        itemStyle: {
                            normal: {
                                barBorderRadius: 2,
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

        var totalNum=$(".page5 .body .tr:first-of-type p:first-of-type .num");
        GztUtil.animateNums(totalNum,[174231,185236],"0");

        var node=$(".page5 .body .tr:first-of-type p:last-of-type .num");
        GztUtil.animateNums(node,[1080476,1280291],"0");

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
                lineWidth : 14,
                value: value,
                bgColor : progressArray[i].bgColor,
                stepColor : progressArray[i].stepColor,
                fillColor : i==2 ? "#121f33" : "",
                speed : 0.5,
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
          , canvas = document.getElementById("page_10_canvas")
        function init(){
            $(canvas).attr({
                "width":winWidth,
                "height" : winHeight
            });
            draw();
            //window.requestAnimationFrame(draw);
        }
        var pointsArr=[
            {
                x : 0,
                y : winHeight*9/10
            },
            {
                x : winWidth*1.8/10,
                y : 7.4*winHeight/10
            },
            {
                x : winWidth*5.5/10,
                y : 7.4*winHeight/10
            },
            {
                x : 8.5*winWidth/10,
                y : 2.5*winHeight/10
            }
        ]

        var angleArr=[];
        angleArr.push( Math.abs( (pointsArr[1].y-pointsArr[0].y)/ (pointsArr[1].x-pointsArr[0].x) ) );
        angleArr.push( Math.abs( (pointsArr[3].y-pointsArr[2].y)/ (pointsArr[3].x-pointsArr[2].x) ) );
debugger
        function draw() {
            var context = canvas.getContext("2d");
            context.globalCompositeOperation = 'destination-over';
            context.clearRect(0,0,winHeight,winHeight); 
            
            context.lineWidth = 8;
            context.strokeStyle = "#24bcff";
            context.fillStyle = "#24bcff";
            
            context.beginPath();
            context.moveTo(pointsArr[0].x,pointsArr[0].y);
            context.lineTo(pointsArr[1].x,pointsArr[1].y);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.moveTo(pointsArr[1].x,pointsArr[1].y);
            context.lineTo(pointsArr[2].x,pointsArr[2].y);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.moveTo(pointsArr[2].x,pointsArr[2].y);
            context.lineTo(pointsArr[3].x,pointsArr[3].y);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.moveTo(pointsArr[3].x-18,pointsArr[3].y-6);  //绘制起始点
            context.lineTo(pointsArr[3].x+18,pointsArr[3].y+6);
            context.lineTo(pointsArr[3].x+10,pointsArr[3].y-25);
            context.fill();   //填充

            window.requestAnimationFrame(draw);
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



$(function(){

    PageSlider.case({ 
        startPage: 10,
        range: 70,
        duration: 200,
        loop: false,
        elastic: true,
        translate3d: true,
        callback: function(index){
            App.renderPage(index);
        }
    });

})
