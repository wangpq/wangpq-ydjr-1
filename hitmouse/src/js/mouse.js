
/********** 地鼠对象 **********/
var Mouse = function(options){
	this._init(options);
}
Mouse.prototype = {
    defaults:{
        /**
         * 地鼠出现的地洞位置
         */
        index: 0,
        /**
         * 地鼠类型(A : 善良的地鼠;B : 邪恶的地鼠(地雷))
         */
        type: "A",
        /**
         * 地鼠向上运动时间
         */
        moveUpTime : 1000,
        /**
         * 地鼠向下运动时间
         */
        moveDownTime : 300,
        /**
         * 生成地鼠前回调函数
         */
        onGenerateMouseBeforeFn : function(){},
        /**
         * 生成地鼠后回调函数
         */
        onGenerateMouseAfterFn : function(){},
        /**
         * 移除地鼠回调函数
         */
        onRemoveMouseAfterFn : function(){},
        /**
         * 点击到地鼠回调函数
         */
        onMouseClickFn : function(){}
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
        // 地鼠被打中状态,默认未打中
        this.hitted=false;
        // 地鼠向上要运动的位置
        this.upDestVal="15%";
        // 地鼠向下要运动的位置
        this.DownDestVal="50%";

        this.options.onGenerateMouseBeforeFn && this.options.onGenerateMouseBeforeFn(this.options);

        this.generateMouse(this.options.index,this.options.type);
        this.controls();
    },
    controls : function(){
        var self=this;
        // 点击地鼠
  
        $(".house").unbind("click").bind("click",function(evt){
            if(this.className.indexOf("generate")>-1){
                self.onMouseClick(this,$(this).index(),"A");
            }
            if(this.className.indexOf("landmine")>-1){
                self.onMouseClick(this,$(this).index(),"B");
            }
            return false;
        })
   
        /*
        $(".house").unbind("tap").bind("tap",function(evt){
            evt.preventDefault();
            if(this.className.indexOf("generate")>-1){
                self.onMouseClick(this,$(this).index(),"A");
            }
            if(this.className.indexOf("landmine")>-1){
                self.onMouseClick(this,$(this).index(),"B");
            }
        })
        */
    },
    generateMouse : function(index,type){
        var self=this
            , houseNodes=document.querySelectorAll(".house")
            , typeStr="";
        var opt={
            index : index,
            type : type
        };

        if(type=="A"){
            typeStr="generate";
        }
        if(type=="B"){
            typeStr="landmine";
        }
        houseNodes[index].classList.add(typeStr);
        self.options.onGenerateMouseAfterFn(opt);
        self.mouseAnimate(houseNodes[index],houseNodes[index].querySelector(".mouse"),opt);
    },
    mouseAnimate : function(house,mouse,opt){
        var self=this,$mouse=$(mouse);
     
        /*
        emile(mouse,  
            'top:'+self.upDestVal+';',{
            easing: WPQ.easeOut,
            duration: self.options.moveUpTime,
            after: function(){   
                emile(mouse,  
                    'top:'+self.DownDestVal+';',{
                    easing: WPQ.easeOut, 
                    duration: self.options.moveDownTime,
                    after: function(){
                        try{
                            house.classList.remove("generate");
                            house.classList.remove("landmine");
                            house.classList.remove("hit");
                        }catch(x){  
                        }
                        self.options.onRemoveMouseAfterFn(opt);
                        self.hitted=false;
                    }
                })   
            }
        })
        */
        $mouse.animate({
            top : self.upDestVal
        },self.options.moveUpTime,function(){
            $mouse.animate({
                top : self.DownDestVal
            },self.options.moveDownTime,function(){
                try{
                    house.classList.remove("generate");
                    house.classList.remove("landmine");
                    house.classList.remove("hit");
                }catch(x){  
                }
                self.options.onRemoveMouseAfterFn(opt);
                self.hitted=false;
            })
        });
    },
    // 点击到地鼠
    onMouseClick : function(dom,index,type){
        var self=this; 
        // 防止多次触发点击事件 onMouseClickFn
        if(!self.hitted){
            self.options && self.options.onMouseClickFn({
                dom : dom,
                index : index,
                type : type
            });
            dom.classList.add("hit");
            // 标志为已被打中
            self.hitted=true;
        }

    }
}
