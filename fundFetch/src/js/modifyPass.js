/*!
 * modifyPass.js 
 * version: v1.0.0; author : Wangpq;
 */
var app={
    init : function(){
        this._init();
        this.render();
        this.controls();
    },
    _init : function(){
    },
    /**
     * 页面初始化
     * @method render
     * @return {Null} 无返回值
     */
    render : function(){
        var self=this;
        FastClick.attach(document.body);
    },
    /**
     * 事件控制函数
     * @method controls
     * @return {Null} 无返回值
     */
    controls : function(){
        var self=this;

        // 返回
        $("#modifyPassPage header a.back").unbind("click").bind("click",function(){
            window.location.href="myFund.html";
        })

        // 确认修改
        $("#btnModify").unbind("click").bind("click",function(){
            self.modifyPassword();
        })

        // popstate
        self.onPopstate();  
    },
    onPopstate : function(){
        /*
        function pushHistory() {  
            var state = {  
                title: "重置密码",  
                url: window.location.href  
            };  
            window.history.pushState(state, "重置密码");  
        }  
        */

        //pushHistory(); 
        var bool=false; 
        var timer=window.setTimeout(function(){ 
            bool=true; 
            window.clearTimeout(timer);
        },1500); 

        window.addEventListener("popstate", function(e) { 
            if(bool){ 
                window.location.href='myFund.html';   
            } 
            //pushHistory(); 
        }, false);  
    },
    modifyPassword : function(){
        var self=this
        , newPass=$("#newPass")
        , reNewPass=$("#reNewPass")
        , newPassVal=$.trim(newPass.val())
        , reNewPassVal=$.trim(reNewPass.val());
        if(newPassVal==""){
            toast("请输入新密码");
            return false;
        }
        if(reNewPassVal==""){
            toast("请再次确认新密码");
            return false;
        } 
        if(newPassVal!==reNewPassVal){
            toast("两次新密码输入不一致");
            return false;  
        }

        $.ajax({
            type : "post",
            url : urlconfig.changePwd,
            data :{
                // 个人公积金账号
                spCode : localStorage.psNo,
                // 新密码
                newpassword :  newPassVal ,
                // 操作标识： 0 修改密码  1重置密码
                flag : "0"
            },
            beforeSend : function(){
                showLoading();
            },
            success : function(res){
                hideLoading();
                if(res){
                    self.responseModifyPassData(res);
                }
            },
            error : function(){
                hideLoading();
                toast("密码重置失败！");
            }
        })
    
        /*
        var res={
            resultCode : 0,
            resultMsg :""
        }
        self.responseModifyPassData(res);
        */
    },
    responseModifyPassData : function(res){
        if(res.resultCode==0){
            toast("密码修改成功");
            var timer=window.setTimeout(function(){
                window.clearTimeout(timer);
                window.location.href="myFund.html";
            },2000) 
        }else if(res.resultCode==-1){
            toast(res.resultMsg || "密码修改失败"); 
        }else{
            toast("密码修改失败"); 
        }
    }
    
    
}

document.addEventListener("DOMContentLoaded", function() {
    app.init();
}, false);
