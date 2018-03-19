/*!
 * card.js version: v1.0.0; author : Wangpq;
 * Date: 2017-06-08T18:00Z
 */
var app = {
    init: function() {
        this._init();
        this.render();
        this.controls()
    },
    _init: function() {
        this.username = this.getUrlParam("username") || "";
        this.btnRefresh = document.querySelector(".icon-refresh")
    },
    render: function() {
        var e = this;
        FastClick.attach(document.body);
        window.setTimeout(function() {
            e.renderGjj()
        },80)
    },
    controls: function() {
        var e = this;
        e.on(document.querySelector("header a.back"), "click",
        function() {
            e.off(this, "click");
            e.historyBack()
        })
    },
    renderGjj: function() {
        var e = this;
        e.qAjax({
            url: urlconfig.queryGjjByTel,
            type: "post",
            data: {
                username: e.username,
                state: 1,
                OpType: "08",
                LoginLy: "02"
            },
            beforeSend: function() {
                showLoading()
            },
            success: function(t) {
                hideLoading();
                e.renderGjjData(t)
            },
            error: function(e) {
                hideLoading();
                if (e && e !== "") {
                    toast(e)
                } else {
                    toast("对不起，请求出错啦!")
                }
            }
        })
    },
    qAjax: function(e) {
        e && e.beforeSend();
        reqwest({
            url: e.url,
            type: "json",
            method: e.method || "post",
            crossOrigin: true,
            data: e.data,
            error: function(t) {
                e.error && e.error(t)
            },
            success: function(t) {
                e.success && e.success(t)
            }
        })
    },
    renderGjjData: function(data) {
        var self = this;
        if(data && data.name && data.name!==""){
            var r = document.querySelector(".card-box");
            r.querySelector(".name").innerHTML = data.name || "";
            r.querySelector(".money").innerHTML = data.balance || "";
            r.querySelector(".num").innerHTML = data.personaccount || "";
            r.querySelector(".info .date").innerHTML = self.getToday()
        } else {
            if(data && data!==""){
                toast(data);
            }else{
                toast("获取数据出错啦！");
            }
        }
    },
    getToday: function() {
        var e = new Date,
        t = e.getFullYear(),
        r = e.getMonth() + 1,
        n = e.getDate();
        r = r < 10 ? "0" + String(r) : r;
        n = n < 10 ? "0" + String(n) : n;
        return t + "-" + r + "-" + n
    },
    historyBack: historyBack,
    getUrlParam: getUrlParam,
    on: function(e, t, r) {
        e.addEventListener ? e.addEventListener(t, r, false) : e.attachEvent("on" + t,
        function() {
            r.call(e)
        })
    },
    off: function(e, t, r) {
        e.removeEventListener ? e.removeEventListener(t, r, false) : e.detachEvent("on" + t, r)
    }
};

document.addEventListener("DOMContentLoaded",function() {
    app.init()
},false);