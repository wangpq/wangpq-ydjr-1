;(function(module,undefined){
      var dynsite = "https://www.gztpay.com:65048";
    //var dynsite = "http://test.gztpay.com:10683";
    var urlconfig = {
        getIndexInfo  : dynsite+'/gztActivityDDS/moleatTack/appService/getIndexInfo',
        insertPlayData  : dynsite+'/gztActivityDDS/moleatTack/appService/insertPlayData',
        rankAll : dynsite+'/gztActivityDDS/moleatTack/appService/rankAll',
        rechargePhone : dynsite+'/gztActivityDDS/moleatTack/appService/rechargePhone'
    };
    module.dynsite=dynsite;
    module.urlconfig=urlconfig;
})(window)
