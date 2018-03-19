/*!
 * gztUtil.js version: v1.0.0; author : Wangpq;
 * Date: 2017-09-18T11:00Z
 */

/********** 扩展方法 **********/
var GztUtil={
    /**
	 * min ≤ r ≤ max
	 */
	randomNumBoth :function (Min,Max){
		var Range = Max - Min;
		var Rand = Math.random();
		var num = Min + Math.round(Rand * Range); //四舍五入
		return num;
	},
    getToday : function(){
        var date=new Date()
          , year=date.getFullYear()
          , month=date.getMonth()+1
          , day =date.getDate()
        month= month<10 ? "0"+String(month) : String(month);
        day= day<10 ? "0"+String(day) : String(day);
        return String(year)+String(month)+String(day);
    },
    getTodayDate : function(){
        var date=new Date()
          , year=date.getFullYear()
          , month=date.getMonth()+1
          , day =date.getDate()
        return String(year)+'年'+String(month)+'月'+String(day)+'日';
    },
    formatNumDot : function(m){
        var m=String(m)
          , num=m.split(".")[0]
          , num_0=m.split(".")[1]
          , re = /\d{3}$/, result = '';  
        while ( re.test(num) ) {  
            result = RegExp.lastMatch + result;  
            if (num !== RegExp.lastMatch) {  
                result = ',' + result;  
                num = RegExp.leftContext;  
            } else {  
                num = '';  
                break;  
            }  
        }  
        if (num) { result = num + result; } 
        if(num_0!==undefined && num_0!==""){
            result= result+'.'+num_0;
        } 
        return result;   
    },
    /** 
     * 动画变化数字 
     * @method animateNums
     * @param {Object} node 要赋值的jQuery对象
     * @param {Array} arr 数据数组
     * @param {String} tag 需要保留的小数点后位数
     * @return {Null} 无返回值 
     */ 
    animateNums : function(node,arr,tag){  
        var self=this
            , numAnimateCount=4
            , num1=arr[0],num2=arr[1];
        node.text( self.formatNumDot( parseFloat(num1).toFixed(parseInt(tag)) )  );
        if(num1<num2){
            var n=(num2-num1)/numAnimateCount;
            var k=1,temp=num1;
            var timer=window.setInterval(function(){
                if(k<numAnimateCount){
                    k++;
                    temp=temp+n;
                    var str= parseFloat(temp).toFixed(parseInt(tag));
                    node.text( self.formatNumDot( str) ) ;  
                }else{
                    node.text( self.formatNumDot(  parseFloat(num2).toFixed(parseInt(tag)) ) ); 
                    window.clearInterval(timer); 
                }   
            },280)  
        }else{
            var num=parseFloat(num2).toFixed(parseInt(tag));
            node.text(self.formatNumDot( num)); 
        }
    },
    renderChart : function(selector,options){
        var dom = document.getElementById(selector);
        var myChart = echarts.init(dom);
        var option = options;
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    },
    drawLine : function(context,x1,x2) {

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

        window.requestAnimationFrame(draw);
    }
}
