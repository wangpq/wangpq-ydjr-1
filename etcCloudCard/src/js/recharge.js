/*!
 * recharge.js
 * version: v1.0.0; author : Wangpq;
 */
var app={
    init : function(){
        this._init();
        this.render();
        this.controls();
    },
    _init : function(){
        var self=this;
    },
    /**
     * 页面初始化
     * @method render
     * @return {Null} 无返回值
     */
    render : function(){
        FastClick.attach(document.body);
        this.initPage();
        pushHistory("recharge");
    },
    initPage : function(){

        var self=this
          , cardType=""
          , cardNo=""
          , type=getUrlParam("type");

        if(type=="ghhyk"){
            cardType="ghk";
            cardNo=localStorage.ghkNum;
        }
        if(type=="etcyfk"){
            cardType="qtk";
            cardNo=localStorage.qtkNum;
        }

        // 卡号
        $(".card .number span").html(cardNo);
        
        // 余额
        self.requestBalance();
    },
    requestBalance : function(){
        var self=this
          , cardType=""
          , cardNo=""
          , type=getUrlParam("type");

        if(type=="ghhyk"){
            cardType="ghk";
            cardNo=localStorage.ghkNum;
        }
        if(type=="etcyfk"){
            cardType="qtk";
            cardNo=localStorage.qtkNum;
        }

        $.ajax({
            url :  urlconfig.queryBalance,
            data : {
                "cardNo"  :  cardNo,  
                "cardType" : cardType
            },
            dataType : "JSON",
            type : "get",
            beforeSend : function(){
                showLoading();
            },
            success : function(data){
                hideLoading();
                $(".page .recharge").show();
                if(data && data.resData){
                    var res=JSON.parse(data.resData);
                    if(res.respCode && res.respCode=="0000"){
                        $(".card .money").html( res.balance ); 
                    }
                }else{
                    $(".card .money").text("0.00"); 
                }   
            },
            error : function(){
                hideLoading();
            }
        }) 
    },
    /**
     * 事件控制函数
     * @method controls
     * @return {Null} 无返回值
     */
    controls : function(){
        var self=this; 
        
        $("header a.back").unbind("click").bind("click",function(){ 
            var type=getUrlParam("type");
            window.location.href='./detail.html?type='+type;
        })

        if (window.history && window.history.pushState) {
            window.addEventListener("popstate", function(e) { 
                var type=getUrlParam("type");
                window.location.href='./detail.html?type='+type;
            }, false); 
        }

        $("header .txt").unbind("click").bind("click",function(){ 
            var type=getUrlParam("type");
            window.location.href='./records.html?type='+type;
        })

        $(".select li").unbind("click").bind("click",function(){
            $(".select li.active").removeClass("active");
            $(this).addClass("active");

            var money=parseInt($(".select .active span").text());
            /*
            var percentNum=1;
            if(money>0 && money<=50){
                percentNum=1;
            }else if(money>50 && money<=100){
                percentNum=0.5;
            }else{
                percentNum=0.2;
            }
            */
            var percentNum=1;
            var serviceMoney= new Number(money*percentNum/100).toFixed(2);
            $(".desc>b").text(serviceMoney);
        })
        
        $(".btn-recharge").unbind("click").bind("click",function(){
            var selectNode=$(".select .active span"); 
            if(selectNode.length!=0){
                var paramType= getUrlParam("type")=="ghhyk" ? "ghk" : "qtk";
                var money=parseInt(selectNode.text())
                  , serviceMoney=$(".desc>b").text()
                  , totalMoney= money+parseFloat(serviceMoney)
                  , totalMoneyStr=new Number(totalMoney).toFixed(2)
                  , tranVoucher =GztUtil.autoOrderId( paramType,(localStorage.username || ""));

                /*
                * 全联征信会来调取本地方法进行支付
                *
                * @param amount        金额
                * @param merchantN     商户号
                * @param userId        用户id(用户手机号)
                * @param merchatPos    商户终端号
                * @param merchantPhone 商户电话
                * @param orderId       订单号
                */

                var androidParam={
                    amount : totalMoneyStr,
                    merchantN : "123456120033",
                    userId : localStorage.username,
                    merchatPos : "30001023",
                    merchantPhone : "15895983640",          
                    orderId : tranVoucher
                }
               
                // 给充值成功后传递数据给服务器的接口用
                localStorage.rechargeMoney=money;
                localStorage.totalMoney=totalMoney;
                localStorage.tranVoucher=tranVoucher;
             
                if( localStorage.platform=="android"){
                    //alert("您的手机系统AA："+localStorage.platform);
                    window.gztPay.doTrade(androidParam.amount, androidParam.merchantN, androidParam.userId, androidParam.merchatPos, androidParam.merchantPhone, androidParam.orderId);
                }else if( localStorage.platform=="ios"){
                    //alert("您的手机系统："+localStorage.platform);

                    /*
                    "amount":"0.01（实际支付金额 元为单位",
                    "terminalNumber":"123456",
                    "orderNum":"1234567",
                    "sellerNumber":"12345",
                    "phone":"15510318895",
                    "isDiscount":"0",
                    "id":"活动ID",
                    "discountAmount":"优惠金额（分为单位）",
                    "discountName":"活动名称",
                    "handlindAmount":"手续费（分为单位）",
                    "payAmount":"原交易金额（分为单位）",
                    "transAmount":"实际支付金额（分为单位）"
                    */
        
                    var iosParam={
                        amount : totalMoneyStr,
                        discountAmount : "0",
                        discountName : "在线充值",
                        handlindAmount : parseFloat(serviceMoney)*100,
                        id : tranVoucher,
                        isDiscount : "0",
                        orderNum : tranVoucher,
                        payAmount : money*100,
                        phone : "15895983640",
                        sellerNumber : "123456120033",
                        terminalNumber : "30001023",
                        transAmount : totalMoney*100,
                    }
                    //alert( "arouseNewPayView"+"$$"+JSON.stringify(iosParam) );
                    window.WebViewBridge.send("arouseNewPayView"+"$$"+JSON.stringify(iosParam) );
                }else{ 
                }
            }else{
                toast("请选择充值金额");
            }
        })
    },
    deposit : function(){
      
        var self=this
          , cardType=""
          , cardNo=""
          , paramType=getUrlParam("type");
        if(paramType=="ghhyk"){
            cardType="ghk";
            cardNo=localStorage.ghkNum;
        }
        if(paramType=="etcyfk"){
            cardType="qtk";
            cardNo=localStorage.qtkNum;
        }

        /*
        alert("准备调用ajax---deposit");
        alert("cardType="+cardType);
        alert("cardNo="+cardNo);
        alert("tranAmount="+localStorage.rechargeMoney);
        alert("tranVoucher="+localStorage.tranVoucher );
        */
        $.ajax({
            url :  urlconfig.deposit,
            data : {
                cardType : cardType ,
                cardNo : cardNo  ,
                tranAmount : localStorage.rechargeMoney ,
                tranVoucher :  localStorage.tranVoucher 
            },
            dataType : "JSON",
            type : "get",
            success : function(data){
                //alert("deposit-充值传递数据给后台--success");
                var money= new Number( parseFloat($(".recharge .card .money").text() ) + parseFloat(localStorage.rechargeMoney)).toFixed(2);
                $(".recharge .card .money").text(money);
            },
            error : function(){
                //alert("deposit-充值传递数据给后台--error");
            }
        })
    }
    
}


/*
 ************************************************************** */

/**
 * 安卓支付回调函数 payResult
 * oderInfo 为订单信息，走收银台查询出来的订单，rCode 支付状态码，payType为支付类型;
 * payType 支付方式：1：银行卡拍卡，2：绑卡支付，3：支付宝，4：微信，5：银联，6：积分，7:云卡支付;
 * rCode : "0" 为支付异常 ； "1" ：支付如失败，需联系客户;"2" ：支付成功 ;"3" : 取消支付
 * msg 支付提示信息
 */
function payesult(oderInfo, rCode, payType,msg){
    if(msg && msg!=="" && String(msg)!=="null" ){
        /*
        alert("4--安卓payesult--="+oderInfo);
        alert(JSON.stringify({
            oderInfo : oderInfo,
            rCode : rCode,
            payType : payType,
            msg : msg
        }));
        */
        if(rCode=="2"){
            app.deposit();
        }
        toast(msg);
    }
}




/*
 ************************************************************** */

/*
payResultDict = {
    pay:'',
    codeNum:'666',
    type:'3',
    errMsg:'网络连接出错,订单支付失败',
    payType:'AliPay',
    paySuccess:'1'
}
*/

/**
 * ios支付回调函数 getPayResult
 * pay:请参考queryTradeRecordForApp接口文档的返回信息
 * codeNum：这是支付宝或者微信返回的错误码。G_Fail代表：支付宝、微信返回支付成功，但是查询收银台发现不成功。
 * type：2绑卡支付；3支付宝；4微信；5银联；
 * payType：支付类型
 * errMsg：这是支付宝或者微信返回的错误信息（根据错误码解析出来的错误信息）成功：支付成功
 * paySuccess：1代表：成功。0代表：失败。
 */
function getPayResult(payResultDict){
    //alert("ios-22-getPayResult--payResultDict="+payResultDict);
    var payResultDict=JSON.parse(payResultDict);
    //alert("paySuccess="+payResultDict.paySuccess);
    if(payResultDict.paySuccess=="1"){ 
        app.deposit();
    }
    toast(payResultDict.errMsg);
}




$(function(){
    app.init();
})
