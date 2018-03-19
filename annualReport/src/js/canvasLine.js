

var CanvasLine = function(options){
	this._init(options);
}
CanvasLine.prototype = {
    defaults:{
        /**
         * canvas对象选择器
         */
        node : "",
        /**
         * 开始点
         */
        startPoint: [0,0],
        /**
         *结束点
         */
        endPoint : [100,100],
        /**
         * 环宽度
         */
        lineWidth : 5,
        /**
         * 线条颜色
         */
        lineColor : "#2b4570",
        /**
         * 动画速度参数
         */
        speed : 0.1,
        /**
         * 进度动画前函数
         */
        beforeFn : function(){},
        /**
         * 完成进度动画函数
         */
        afterFn : function(){}
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
        // 正切角度
        this.angle= Math.abs( (this.options.endPoint[1]-this.options.startPoint[1])/ (this.options.endPoint[0]-this.options.startPoint[0]) ),
        // 初始X值
        this.nowXValue=this.options.startPoint[0];
        this.nowYValue=this.options.startPoint[1]; 
    },
    render : function(){
        var self=this;
        self.options.beforeStepFn();
		//动画循环
		(function drawFrame(){
			window.requestAnimationFrame(drawFrame, self.canvas);
            self.context.clearRect(0, 0, self.canvas.height, self.canvas.height);
    
			self.drawLine();
			if(self.nowXValue >= self.options.endPoint[0]){
                self.nowXValue=self.options.endPoint[0];
                self.nowYValue=self.options.endPoint[1];  
                self.options.afterFn();
                return false;
            }
            self.nowXValue += self.options.speed;
            self.nowYValue -= self.options.speed* self.angle
		}());
    },
    drawLine : function(){

    }
}



