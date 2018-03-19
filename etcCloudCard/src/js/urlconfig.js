;(function(module,undefined){
    var dynsite="https://www.gztpay.com:65080";
    //var dynsite="http://test.gztpay.com:31211";
    var urlConf = {
        // 用户卡绑定状态
        verifyActivate : dynsite+"/ETCCloudAdditionalCard/appServiceCtrl/verifyActivate",
        // 绑定黔通卡
        verifyEtcUser  : dynsite+"/ETCCloudAdditionalCard/appServiceCtrl/verifyEtcUser",
        // 绑定工会卡
        verifyGhkUser  : dynsite+"/ETCCloudAdditionalCard/appServiceCtrl/verifyGhkUser", 
        // 充值
        deposit : dynsite+"/ETCCloudAdditionalCard/appServiceCtrl/deposit", 
        // 查询余额 
        queryBalance : dynsite+"/ETCCloudAdditionalCard/appServiceCtrl/queryBalance"
    };
    module.dynsite=dynsite;
    module.urlconfig=urlConf;
})(window)
