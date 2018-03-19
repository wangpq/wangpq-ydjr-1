if(!GztUtil){
    var GztUtil={};
}

/*!
 * handleResult.js
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
        FastClick.attach(document.body);
        this.initPage();
    },
    /**
     * 事件控制函数
     * @method controls
     * @return {Null} 无返回值
     */
    controls : function(){
        var self=this;
        // 返回
        $("header a.back").unbind("click").bind("click",function(){
            //window.location.href='prepayment.html';
            window.location.href='myFund.html';
        })

        // 确认
        $("#btnSure").unbind("click").bind("click",function(){
            window.location.href='myFund.html';
        })

        // popstate
        self.onPopstate(); 
    },
    initPage : function(){
        var self=this;
        $.ajax({
            type : "post",
            url : urlconfig.queryRepayPlan,
            data :{
                // 个人公积金账号
                spCode :  localStorage.psNo
            },
            beforeSend : function(){
                showLoading();
            },
            success : function(res){
                hideLoading();
                if(res){
                    //var hkje=getUrlParam("hkje")
                    //, dkye=getUrlParam("dkye");
                    //, bjye=(parseFloat(localStorage.balance)-parseFloat(hkje)).toFixed(2);
            
            //alert('getUrlParam--hkje='+hkje);
            //alert('localStorage.balance='+parseFloat(localStorage.balance));
            //alert('bjye--1='+(parseFloat(localStorage.balance)-parseFloat(hkje)).toFixed(2));
            //alert('bjye--2='+parseFloat(parseFloat(localStorage.balance)-parseFloat(hkje)).toFixed(2));

                    //$("#loanPrincipleSum").text(hkje);
                    //$("#loanPrincipleBalance").text(bjye);

                    self.responseHandleData(res);
                }
            },
            error : function(){
                hideLoading();
                toast("获取还款计划数据失败！");
            }
        })

        /*
        var res={
            resultCode : 0,
            data : [
                {
                    spname : "王弘",
                    spidno : "522112245654546",
                    hkzh : "11222",
                    fdrq : "2014-09-18",
                    jkje : "31022.01",
                    jsrq : "2018-09-10",
                    hkym : "2017/10",
                    hkrq : "2017.11.14",
                    hj : "25000.00",
                    bjye : "42133.10"
                },
                {
                    spname : "王弘",
                    spidno : "522112245654546",
                    hkzh : "11222",
                    fdrq : "2014-09-18",
                    jkje : "31022.01",
                    jsrq : "2018-09-10",
                    hkym : "2017/10",
                    hkrq : "2017.11.14",
                    hj : "15000.00",
                    bjye : "52233443.10"
                }
            ]
        }
        self.responseHandleData(res);
        */
    },
    onPopstate : function(){
        /*
        function pushHistory() {  
            var state = {  
                title: "title",  
                url: "#"  
            };  
            window.history.pushState(state, "title", "#");  
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
    responseHandleData : function(res){
        if(res.resultCode==0){
            if(res.data && res.data.length>0){
                var tpl_1="",tpl_2="";
                res.data.forEach(function(dom,index) {
                    if(index==0){
                        tpl_1=
                        '<h2>个人还款计划书</h2>'+
                        '<div class="bd">'+
                            '<p>'+
                                '<span class="name">姓名</span>'+
                                '<span class="val">'+dom.spname+'</span>'+
                            '</p>'+
                            '<p>'+
                                '<span class="name">身份证</span>'+
                                '<span class="val">'+dom.spidno+'</span>'+
                            '</p>'+
                            '<p>'+
                                '<span class="name">贷款账号</span>'+
                                '<span class="val">'+dom.hkzh+'</span>'+
                            '</p>'+
                            '<p>'+
                                '<span class="name">放款日期</span>'+
                                '<span class="val">'+dom.fdrq+'</span>'+
                            '</p>'+
                            '<p>'+
                                '<span class="name">贷款金额</span>'+
                                '<span class="val">'+dom.jkje+'元</span>'+
                            '</p>'+
                            '<p>'+
                                '<span class="name">结束日期</span>'+
                                '<span class="val">'+dom.jsrq+'</span>'+
                            '</p>'+
                        '</div>';
                    }
                    tpl_2+=
                    '<tr>'+
                        '<td>'+(index+1)+'</td>'+
                        '<td>'+dom.hkym+'</td>'+
                        '<td>'+dom.hkrq+'</td>'+
                        '<td>'+dom.hj+'</td>'+
                        '<td>'+dom.bjye+'</td>'+
                    '</tr>';
                });

                // 还款金额
                $("#loanPrincipleSum").html(getUrlParam("hkje"));
                // 本金余额
                $("#loanPrincipleBalance").html(res.data[0].bjye);

                $(".handle-result .list-view").html(tpl_1);
                $(".handle-result table tbody").html(tpl_2);
                $(".handle-result").addClass("success").show();
            }else{
                $(".handle-result").addClass("fail").show(); 
            }
        }else{
            $(".handle-result").addClass("fail").show(); 
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    app.init();
}, false);
