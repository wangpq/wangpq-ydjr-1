;(function(exports,undefined){
    var GztUtil={
        wpDialogConfirm : function(options){
            var self=this
              , dialog=document.querySelector('[data-dialog="true"]')
              , dialogBtnClose=dialog.querySelector(".close")
              , dialogBd=dialog.querySelector('[wp="wpdom"]')
              , dialogTitle=dialog.querySelector(".body .head")
              , dialogText=dialog.querySelector(".body .text")
              , btnOk=dialog.querySelector(".ok")
              , btnNo=dialog.querySelector(".no");

            var config={
                dialog : dialog,
                dialogBtnClose : dialogBtnClose,
                dialogBd : dialogBd,
                dialogTitle : dialogTitle,
                dialogText : dialogText,
                btnOk : btnOk,
                btnNo : btnNo
            }
            options.beforeShowFn && options.beforeShowFn(config);
            dialog.className.indexOf("alert")>-1 ? dialog.classList.remove("alert") : null ;
            options.title && options.text!=="" ? dialogTitle.innerHTML=options.title : null;
            options.text && options.text!=="" ? dialogText.innerHTML=options.text : null;
            options.btnOkText && options.btnOkText!=="" ? btnOk.innerHTML=options.btnOkText: null;
            options.btnNoText && options.btnNoText!=="" ? btnNo.innerHTML=options.btnNoText : null;

            dialog.style.display="block";
            options.afterShowFn && options.afterShowFn(config);


            $(dialogBtnClose).unbind("click").bind("click",function(){
                options.afterCloseFn && self.dialogClose(options.afterCloseFn);
                self.dialogClose();
            })

            $(dialog.querySelector(".ok")).unbind("click").bind("click",function(){
                 options.okFn && options.okFn && options.okFn(config);
            })

            $(dialog.querySelector(".no")).unbind("click").bind("click",function(){
                self.dialogClose();
                options.noFn && options.noFn(config);
            })
        },
        dialogClose : function(fn){
            document.querySelector('[data-dialog="true"]').style.display="none";
            fn && fn();
        },
        // 生成一个唯一的ID
        uuid : function(){
            var d = new Date().getTime();
            var uuid = 'gyxx_xx_4xx_yxx_xx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        },
        getNewDate : function(){
            var date=new Date()
              , year=date.getFullYear()
              , month=date.getMonth()+1
              , day=date.getDate()
              , hours=date.getHours()
              , minutes=date.getMinutes()
              , seconds=date.getSeconds()
              , milliseconds=date.getMilliseconds();
            month= month<10 ? "0"+String(month) : String(month);
            day= day<10 ? "0"+String(day) : String(day);
            hours= hours<10 ? "0"+String(hours) : String(hours);
            minutes= minutes<10 ? "0"+String(minutes) : String(minutes);
            seconds= seconds<10 ? "0"+String(seconds) : String(seconds);
            if(milliseconds<10){
                milliseconds="00"+String(milliseconds);
            }
            if(milliseconds>=10 && milliseconds<100){
                milliseconds="0"+String(milliseconds);  
            }
            return String(year)+String(month)+String(day)+String(hours)+String(minutes)+String(seconds)+String(milliseconds);
        },
        formatTime : function(num){
            var date=new Date()
              , hours=""
              , minutes="";
            date.setTime(num);
            hours=date.getHours();
            minutes=date.getMinutes();
            hours=hours>9 ? hours : "0"+String(hours);
            minutes=minutes>9 ? minutes : "0"+String(minutes);
            return String(hours)+":"+String(minutes);
        },
        autoOrderId : function(prev,last){
            return (prev || "")+ this.getNewDate()+(last || "")
        },
        formatCardNumSpace : function(num){
            var num=String(num)
              , str="";
            for(var i=0,len=num.length;i<=len;i++){
               if(i%4==0){
                  str+= " "+num.slice(i,i+4);
               }
            }
            return str ;
        }

    }
    exports.GztUtil=GztUtil;
})(window)

