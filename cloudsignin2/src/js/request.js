/*!
 * request.js version: v1.0.0; author : Wangpq;
 * Date: 2017-07-17T11:30Z
 */
var app={
    init : function(){
        this.render();
        this.controls();
    },
    render : function(){
        FastClick.attach(document.body);
    },
    controls : function(){
        var self=this;

        document.querySelector("header .back").addEventListener('click', function() {
            self.historyBack();
        }, false);

        document.getElementById("btnOpen").addEventListener('click', function() {
            self.openApp();
        }, false);	
    },
    openApp : function(){
        var self=this
            , data
            , name=document.getElementById("name")
            , contact =document.getElementById("contact") 
            , tel=document.getElementById("tel") 
            , scale =document.getElementById("scale") ;

        if(self.trim(name.value)=="" || self.trim(contact.value)=="" || self.trim(tel.value)=="" || self.trim(scale.value)=="---"){
            toast("请填入全部资料");
            return false;
        }
        if(!self.trim(name.value).match(/^(?!_)(?!.*?_$)[\w\u4E00-\u9FA5\uF900-\uFA2D]{5,20}$/) ) {
            toast("公司名称只能包含5到20个字符,不能以下划线开头和结尾!");
            return false;     
        } 
        if(!self.trim(contact.value).match(/^(?!_)(?!.*?_$)[\w\u4E00-\u9FA5\uF900-\uFA2D]{2,15}$/) ) {
            toast("联系人为2到15个字符!");
            return false;     
        } 
        data={
            "pbocOpenApplicationName":  self.trim(contact.value),
            "pbocOpenApplicationPhone":  self.trim(tel.value),
            "pbocOpenApplicationCmpName":  self.trim(name.value),
            "pbocOpenApplicationCmpScale":  self.trim(scale.value)
        }
        document.getElementById("loading").classList.remove("invisibile");
        httpRequest(JSON.stringify(data) , urlConf.openApplication , self.openApplication, 3); 
    },
    openApplication : function(data){
        document.getElementById("loading").classList.add("invisibile");    
        if( data && data.status == "0"){
            toast("申请成功，我们将在12个工作小时内将联系您!");
            self.historyBack();
            return false;
        }
        else if ( data && data.error ) { 
            toast("申请失败，请重试！");
            return false;
        } 
    },
    /**
     * 去除左右空白
     * @method trim
     * @return {String} 返回字符串
     */
    trim : function(str){
        return str.replace(/(^\s*)|(\s*$)/g,'');
    },
    /**
     * 返回并刷新
     * @method historyBack
     * @return {Null} 无返回值
     */
    historyBack : historyBack
}


app.init();