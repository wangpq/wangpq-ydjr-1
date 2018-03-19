/*!
 * GztUtil.js version: v1.0.0; author : Wangpq;
 * date: 2017-07-28T17:00Z
 * update : 2017-08-24T10:00Z
 */
var GztUtil={
    getToday : function(){
        var date=new Date()
          , year=date.getFullYear()
          , month=date.getMonth()+1
          , day =date.getDate()
        month= month<10 ? "0"+String(month) : month;
        day= day<10 ? "0"+String(day) : day;
        return String(year)+String(month)+String(day);
    },
    /**
     *替换身份证号中间数字为*
     */
    idReplaceToStars: function(str){
        var reg = /(\d{3})\d{11}(\d{4})/g;
        return str.replace(reg,"$1***********$2");
    }
}
