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
        }
    }
    exports.GztUtil=GztUtil;
})(window)
