(function(module,undefined) {
    var dynsite = "https://www.gztpay.com:65007";
    // var dynsite = "http://pay.gztpay.com:8380";
    var urlconfig = {
        queryGjjByIdNum: dynsite + "/QueryOGL/gzgjj/queryGJJInterface",
        queryGjjByTel: dynsite + "/QueryOGL/gzgjj/queryGJJ"
    };
    module.dynsite = dynsite;
    module.urlconfig = urlconfig
})(window);
