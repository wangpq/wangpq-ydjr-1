/********** 雪花对象 **********/
var Snow = function(options){
	this._init(options);
}
Snow.prototype = {
    defaults:{
        /**
         * 要渲染的雪花画布对象
         */
        parentNode : "",
        /**
         * 雪花停留(运动)时间
         */
        stayTime : 10000,
        /**
         * 雪花运动距离
         */
        distance : 0,
        /**
         * 雪花创建前回调函数
         */
        onBeforeCreate : function(){},
        /**
         * 雪花创建后回调函数
         */
        onAfterCreate : function(){},
        /**
         * 雪花删除前回调函数
         */
        onBeforeRemove : function(){},
        /**
         * 雪花删除后回调函数
         */
        onAfterRemove : function(){}
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
        this.views();
        this.controls();
    },
    views : function(){
        this.create();
    },
    controls : function(){
    },
    create : function(){
        var self=this
            , snowaArr=[]
            , tpl="";

        self.options.onBeforeCreate && self.options.onBeforeCreate();

        for(var i=0;i<6;i++){
            var udid=GztUtil.uuid();
            snowaArr.push(udid);
            var _width=GztUtil.randomNumBoth(1,4),
                _height=_width*GztUtil.randomNumBoth(8,11)/10;
            tpl+='<div id="'+udid+'" class="snow" style="width:0.'+_width+'rem;height:0.'+_height+'rem;left:'+GztUtil.randomNumBoth(0,90)+'%;top:-'+GztUtil.randomNumBoth(1,4)+'%;"></div>';
        }

        self.options.parentNode.append(tpl); 
        self.options.onAfterCreate && self.options.onAfterCreate();
        self.options.onBeforeRemove && self.options.onBeforeRemove();

        snowaArr.forEach(function(dom,index){
            emile(dom,  
                'top:8rem;',{
                duration: self.options.stayTime,
                after: function(){
                    document.getElementById(dom).remove();
                    self.options.onAfterRemove && self.options.onAfterRemove(); 
                }
            })
            /*
            $(dom).animate({
                'top' : "12rem"
            },self.options.stayTime,function(){
                document.getElementById(dom).remove();
                self.options.onAfterRemove && self.options.onAfterRemove(); 
            })
            */
        })
    }
}
