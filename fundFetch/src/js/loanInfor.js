if(!GztUtil){
    var GztUtil={};
}

/*!
 * loanInfor.js 
 * version: v1.0.0; author : Wangpq;
 */
var app={
    init : function(){
        this._init();
        this.render();
        this.controls();
    },
    _init : function(){
        this.source=getUrlParam("source");
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
            window.location.href='myFund.html';
        })

        // 提前还款
        /*
        $(".loanInfor .btn").unbind("click").bind("click",function(){  
            window.location.href="prepayment.html?hkzh="+$(this).attr("data-id");
        })
        */
        // popstate
        self.onPopstate();         
    },
    initPage : function(){
        var self=this;
 
        $.ajax({
            type : "post",
            url : urlconfig.queryUserLoan,
            data :{
                // 个人公积金账号
                spCode :  localStorage.psNo,
                // 身份证号
                idNo : localStorage.idNo
            },
            beforeSend : function(){ 
                showLoading();
            },
            success : function(res){ 
                hideLoading();
                if(res){
                    self.responseLoadData(res);
                }
            },
            error : function(){
                $(".loanInfor").addClass("fail").show();
                //toast("获取用户公积金贷款信息失败！");
            }
        })
       

        /*
        var res={
            resultCode : 0,
            resultMsg : "",
            data :[
                {
                    // 借款人姓名
                    spname : "张某某",
                    // 购房地址
                    xxdz : "贵阳市南明区社的士速递收到的多少多少多师大师大是",
                    // 贷款金额
                    jkje : "41022.00",
                    // 贷款年限
                    jkqx : "20",
                    // 借款日期
                    fdrq : "2014-09-18",
                    // 贷款余额
                    bjye : "123251.15",
                    // 还款账号
                    hkzh : "1221001"
                }
            ]
        }
        self.responseLoadData(res);
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
    responseLoadData : function(res){
        var self=this;
        if(res.resultCode==0){
            if(res.data){
                if(res.data.length>0){
                    $(".loanInfork").show();
                    
                    var tpl="",
                        btnDisplayFlag=self.source=='look'? ' style="display:none;"' : '';
                    res.data.forEach(function(dom,index) {
                        tpl+=
                        '<div class="list-view" data-fdrq="'+dom.fdrq+'"  data-yhym="'+dom.yhym+'">'+
                           '<h2>贷款'+(index+1)+'</h2>'+
                           '<div class="bd">'+
                            '<p>'+
                                '<span class="name">借款人姓名</span>'+
                                '<span class="val">'+dom.spname+'</span>'+
                            '</p>'+
                            '<p>'+
                                '<span class="name">购房地址</span>'+
                                '<span class="val">'+dom.xxdz+'</span>'+
                            '</p>'+
                            '<p>'+
                                '<span class="name">贷款金额</span>'+
                                '<span class="val">'+dom.jkje+'元</span>'+
                            '</p>'+	
                            '<p>'+
                                '<span class="name">贷款年限</span>'+
                                '<span class="val">'+dom.jkqx+'年</span>'+
                            '</p>'+	
                            '<p>'+
                                '<span class="name">借款日期</span>'+
                                '<span class="val">'+dom.fdrq+'</span>'+
                            '</p>'+	
                            '<p>'+
                                '<span class="name">贷款余额</span>'+
                                '<span class="val">'+dom.bjye+'元</span>'+
                            '</p>'+
                            '<p'+btnDisplayFlag+'>'+
                                '<span class="btn btn-primary" data-id="'+dom.hkzh+'">提前还款</span>'+
                            '</p>'+
                            '</div>'+
                        '</div>';	
                    });

                    
                    $(".loanInfor .ok").html(tpl);
                    $(".loanInfor").addClass("success").show();

                    // 提前还款
                    $(".loanInfor .btn").unbind("click").bind("click",function(){  
                        self.btnPrevLoanClick($(this));
                    })
                }else{
                    $(".loanInfor").addClass("fail").show();
                    //$(".loanInfor").html('<div class="tip">该职工公积金账号下未办理公积金贷款，请核实</div>');
                }

            }
        }else{
            $(".loanInfor").addClass("fail").show();
            //toast("获取公积金贷款信息失败！");  
        }
    },
    btnPrevLoanClick : function(node){  
        // 公积金贷款必须还满12个月后才能还款  
        var parentNode=node.parents(".list-view")
          , num=parentNode.attr("data-fdrq").substr(0,6)  // 贷款(借款)年月
          , num1=parentNode.attr("data-yhym").substr(0,6) // 最近一次还款年月
          , num2=num.substr(0,2)+String(parseInt(num.substr(2,2))+1)+num.substr(-2,2); // 贷款(借款)年月一年后

        if(parseInt(num2)<parseInt(num1)){
             window.location.href="prepayment.html?hkzh="+node.attr("data-id");   
        }else{
             toast("公积金贷款必须还满12个月后才能还款!");
             return false;
        }
    }
    
}

document.addEventListener("DOMContentLoaded", function() {
    app.init();
}, false);
