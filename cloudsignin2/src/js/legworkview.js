/*!
 * legworkview.js version: v1.0.0; author : Wangpq;
 * Date: 2017-07-17T11:30Z
 */
var app={
    init : function(){
        this.render();
        this.controls();
    },
    render : function(){
        FastClick.attach(document.body);
        this.getOutside();
    },
    controls : function(){
        var self=this;
        // 返回
        document.querySelector("header .back").addEventListener('click', function() {
            self.historyBack();
        }, false);
    },
    getOutside : function(){
        var self=this;
        $.ajax({
            type : "POST",
            data : {
                userid : localStorage.pbocUserId,
                signindate : self.getUrlParam("signindate"),
                signType : self.getUrlParam("signType")
            },
            url:urlConf.getOutside,
            success : function(data){
                var data=JSON.parse(data);
                if(data.status && data.status=="0" && data.outside){
                    self.renderSignInData(data)
                }else if(data.status && data.status=="1" && data.error){
                    toast(data.error)
                }
            }
        })
    },
    renderSignInData : function(data){
         if(data.outside){
            var imgTpl=""
              , outside=data.outside
              , address=outside.outsideaddress
              , reason =outside.reason
            if(outside.aBase64){
                imgTpl+='<img src="'+'data:image/jpeg;base64,'+outside.aBase64+'" alt="图一">'
            }
            if(outside.bBase64){
                imgTpl+='<img src="'+'data:image/jpeg;base64,'+outside.bBase64+'" alt="图二">'
            }
            if(outside.cBase64){
                imgTpl+='<img src="'+'data:image/jpeg;base64,'+outside.cBase64+'" alt="图三">'
            }
         }
         document.getElementById("reason").value=reason;
         document.getElementById("address").value=address;
         document.querySelector(".form .img-set").innerHTML=imgTpl;
    },
    /**
     * 返回并刷新
     * @method historyBack
     * @return {Null} 无返回值
     */
    historyBack : historyBack,
    getUrlParam : getUrlParam
}


app.init();