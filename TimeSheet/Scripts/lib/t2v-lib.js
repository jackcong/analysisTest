var t2v_lib = {
    culture: {},
    valid: {},
    tab: {},
    security: {},
    helper: {},
    staticflag: {},
    history: {},
    download: {},
    t2valert: {},
    t2vconfirm: {},
    t2vformat: {},
    t2vmenu: {},
    browser: {},
    DateCalculate: {}
};

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
t2v_lib.DateCalculate =
    {
        getWeek: function (selectedDate)
        {
            var d2 = new Date(selectedDate.getFullYear(), 0, 1);
            var d = Math.round((selectedDate - d2) / 86400000);
            return Math.ceil((d + ((d2.getDay() + 1) - 1)) / 7);
        }

    };

t2v_lib.animation = {
    flash: function (obj, time, wh, fx) {
        $(function () {
            var $panel = $(obj);
            var offset = $panel.offset() - $panel.width();
            var x = offset.left;
            var y = offset.top;
            for (var i = 1; i <= time; i++) {
                if (i % 2 == 0) {
                    $panel.animate({ left: '+' + wh + 'px' }, fx);
                } else {
                    $panel.animate({ left: '-' + wh + 'px' }, fx);
                }
            }
            $panel.animate({ left: 0 }, fx);
            $panel.offset({ top: y, left: x });
        })
    },
};
t2v_lib.history = {
    h_flag: false,
    h_login: false,
    h_list: new Array(10),
    h_index: 0,
    SaveHistory: function (index) {
        if (document.getElementById('hisStoryFrame')) {
            if (t2v_util.history.h_index == 9) {
                t2v_util.history.h_index = 0;
            } else {
                t2v_util.history.h_index++;
            }
            t2v_util.history.h_list[t2v_util.history.h_index] = index;
            document.getElementById('hisStoryFrame').src = 'Browser.aspx?' + t2v_util.history.h_index;
        }
    },
    GetHistory: function (curIndex) {
        if (curIndex != t2v_util.history.h_index) {
            t2v_util.history.h_index = curIndex;
            t2v_util.history.h_flag = true;
            $('#MainTab').tabs('select', t2v_util.history.h_list[curIndex]);
            if (t2v_util.history.h_list[curIndex] == 3)
                $("#ctl00_ContentPlaceHolderMain_liNotification").css("display", "block");
            if (t2v_util.history.h_list[curIndex] == 2)
                $("#ctl00_ContentPlaceHolderMain_liReport").css("display", "block");
            t2v_util.history.h_flag = false;
        }
    },
    GetRootPath: function () {
        //var strFullPath = window.document.location.href;

        //var pos = strFullPath.indexOf(strPath);
        //var prePath = strFullPath.substring(0, pos);
        //var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
        //return (prePath + postPath);

        var host = window.document.location.host;
        var pathName = window.document.location.pathname;
        var protocol = window.document.location.protocol;
        return (protocol + pathName + host);
    },
};