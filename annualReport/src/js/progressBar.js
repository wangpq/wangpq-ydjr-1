

var ProgressBar = function(options){
	this._init(options);
}
ProgressBar.prototype = {
    defaults:{
        /**
         * canvas对象选择器
         */
        node : "",
        /**
         * 环宽度
         */
        lineWidth : 5,
        /**
         * 进度值
         */
        value: 0,
        /**
         * 环背景色
         */
        bgColor : "#2b4570",
        /**
         * 外环填充色
         */
        stepColor : "#aa4bff",
        /**
         * 内环填充色
         */
        fillColor : "#121f33",
        /**
         * 动画速度参数
         */
        speed : 0.1,
        /**
         * 进度动画函数
         */
        stepFn : function(){},
        /**
         * 进度动画前函数
         */
        beforeStepFn : function(){},
        /**
         * 完成进度动画函数
         */
        afterStepFn : function(){}

    },
    extend : function(){
        function cloneObj(oldObj) {
            if (typeof(oldObj) != 'object')
                return oldObj;
            if (oldObj == null)
                return oldObj;
            var newObj = new Object();
            for (var i in oldObj)
                newObj[i] = cloneObj(oldObj[i]);
            return newObj;
        };

        var args = arguments;
        if (args.length < 2) return;
        var temp = cloneObj(args[0]);
        for (var n = 1; n < args.length; n++) {
            for (var i in args[n]) {
                temp[i] = args[n][i];
            }
        }
        return temp;
    },
    _init : function(options){ 
        this.options=this.extend({}, this.defaults, options);
        this.initParams();
        this.render();
    },
    initParams : function(){
        this.canvas=this.options.node;
        this.context= this.canvas.getContext('2d');
        // 圆的中心的 x 坐标
        this.x= this.canvas.width/2,
        // 	圆的中心的 y 坐标
        this.y= this.canvas.height/2,
        // 圆的半径 
        this.r= (this.canvas.width-this.options.lineWidth*2)/2
        // 将360度分成100份，那么每一份就是rad度
        this.rad=Math.PI*2/100;
        // 
        this.nowValue=this.options.speed; 
    },
    render : function(){
        var self=this;
        self.options.beforeStepFn();
		//动画循环
		(function drawFrame(){
            window.requestAnimationFrame(drawFrame, self.canvas);
            self.context.clearRect(0, 0, self.canvas.height, self.canvas.height);
            self.outerCircleBg();
            self.outerCircle();
			//text(self.speed);
			self.innerCircle(self.nowValue);
			if(self.nowValue >= self.options.value){
                self.nowValue=self.options.value;
                self.options.afterStepFn(self.options.value);
                return false;
            }
            self.nowValue += self.options.speed;
            self.options.stepFn(self.nowValue);
		}());
    },
    innerCircle : function(n){ 
        var self=this
          , ctx=self.context;

        ctx.save();
        //设置描边样式
        ctx.strokeStyle = self.options.stepColor; 
        //设置描边样式
        ctx.fillStyle = self.options.fillColor; 
        //设置线宽
        ctx.lineWidth = self.options.lineWidth;
        //路径开始
        ctx.beginPath(); 
        //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
        ctx.arc(self.x, self.y, self.r , -Math.PI/2, -Math.PI/2 +n*self.rad, false); 
        //绘制
        ctx.stroke(); 
        //路径结束
        ctx.closePath(); 
        ctx.restore();  
    },
    outerCircle : function(){
        var self=this
          , ctx=self.context;

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = self.options.bgColor;

        //设置线宽
        ctx.lineWidth = self.options.lineWidth; 
     
        ctx.arc(self.x, self.y, self.r , 0, Math.PI*2, false);
        ctx.stroke();
        //设置描边样式
        ctx.fillStyle = self.options.fillColor; 
        ctx.closePath();
        ctx.restore(); 
    },
    outerCircleBg : function(){
        var self=this
          , ctx=self.context;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = self.options.bgColor;

        //设置线宽
        ctx.lineWidth = 0; 
     
        ctx.arc(self.x, self.y, self.r , 0, Math.PI*2, false);

        ctx.fillStyle = self.options.fillColor; 
        ctx.fill();

        ctx.closePath();
        ctx.restore(); 
    }

}



