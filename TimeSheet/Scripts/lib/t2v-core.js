var t2v_util = {

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
    browser: {}
};



String.prototype.Trim = function(){ return Trim(this);}
String.prototype.LTrim = function(){return LTrim(this);}
String.prototype.RTrim = function () { return RTrim(this); }

String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)){
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}

function LTrim(str)
{
    var i;
    for(i=0;i<str.length;i++)
    {
        if(str.charAt(i)!=" "&&str.charAt(i)!=" ")break;
    }
    str=str.substring(i,str.length);
    return str;
}
function RTrim(str)
{
    var i;
    for(i=str.length-1;i>=0;i--)
    {
        if(str.charAt(i)!=" "&&str.charAt(i)!=" ")break;
    }
    str=str.substring(0,i+1);
    return str;
}
function Trim(str)
{
    return LTrim(RTrim(str));
}

t2v_util.initPasteImage=function()
{
    $("html").pasteImageReader(function (results) {
        var dataURL, filename;
        dataURL = results.dataURL;
        
        //use ajax to upload file
        $.ajax({
            url: "/Handler/UploadFile.ashx",
            type: "POST",
            data: { Filedata: dataURL },
            beforeSend: function () {
                $("#MyPasteZone").append("<img id='imgLoading' src='../../Content/images/load.gif' />");
            },
            success: function (url) {
                $("#MyPasteZone").find("#imgLoading").remove();
                $("#MyPasteZone").append("<img alt='' src='" + url + "' id='imgD' onclick='ShowOriImg(this.src);' title='Click to view original image.'/>");
            },
            error: function (status) {
                if (status.status != 401)
                    alert(status);
            }
            });

        });
},
t2v_util.browser=
{
    IsMobile:function()
    {
        var u = navigator.userAgent;
        return !!u.match(/AppleWebKit.*Mobile.*/);
     }()
};
t2v_util.t2valert =
{
    showAlert: function (content,title,execWhenClose) {
        if(title == undefined)
        {
            title = "HDS";
        }
        $("#spDialogContent").text(content);
        $("#dialog-confirm").dialog({ modal: true, title: title, buttons: [{ text: "OK", class: "btn05", click: function () { $(this).dialog("close"); if (execWhenClose != undefined) execWhenClose(); } }] });
        $("#dialog-confirm").dialog("open");
        $("#dialog-confirm").parent().css("z-index", "10001");
    },
    showAlertHtml: function (content,title,execWhenClose) {
    if(title == undefined)
    {
        title = "HDS";
    }
    $("#spDialogContent").html(content);
    $("#dialog-confirm").dialog({ modal: true, title: title, buttons: [{ text: "OK", class: "btn05", click: function () { $(this).dialog("close"); if (execWhenClose != undefined) execWhenClose(); } }] });
    $("#dialog-confirm").dialog("open");
    $("#dialog-confirm").parent().css("z-index", "10001");
}
};
t2v_util.t2vconfirm =
{
    showConfirm: function (content, OkMethod, CancelMethod,title) {
        if(title == undefined)
        {
            title = "OCZ";
        }
        $("#spDialogContent").html(content);
        //$("#spDialogContent").text(content);
        $("#dialog-confirm").dialog({ modal: true, title: title, width: 480, buttons: [{ text: "YES", class: "btn05", click: function () { $(this).dialog("close"); OkMethod(); } }, { text: "NO", class: "btn05", click: function () { $(this).dialog("close"); CancelMethod(); } }] });
        $("#dialog-confirm").dialog("open");

        $("#dialog-confirm").css("z-index", "10001");
        $("#dialog-confirm").parent().css("z-index", "10001");
    }
};


t2v_util.download = {
    DownloadFile: function (url) {
        var elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    },
    GetFileForDownload: function(url, pageType, exportType, oid){
        $.ajax({
            type: "POST",
            url: url,
            data: {pageType: pageType, exportType: exportType, oid: oid},
            success: function (response) {
                t2v_util.download.DownloadFile(response);
            },
            error: function (xml, status) {
                alert("There problem when you get download file, please contact your IT.")
            }
            });
    },
};
t2v_util.staticflag = {
    EditFlag: false
};

t2v_util.history = {
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
        var strFullPath = window.document.location.href;
        var strPath = window.document.location.pathname;
        var pos = strFullPath.indexOf(strPath);
        var prePath = strFullPath.substring(0, pos);
        //var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
        //return (prePath + postPath);
        return (prePath);
    },
};
t2v_util.security = {
    RequestSecurityPage: function () {
        T2VForm.RequestPage('UserControl/Common/MasterMessage.uc', document.getElementById("MasterMessage"));
        $.ajax({
            type: "GET",
            url: "AjaxSecurityPage.aspx",
            data: "ranArg=" + Math.random(),
            success: function (response) {
                return;
            },
            error: function (xml, status) {
                document.location.href = 'signin.aspx';
            }
        });
    },
    Init: function () {
        T2VForm.RequestPage('UserControl/Common/MasterMessage.uc', document.getElementById("MasterMessage"));
        setInterval("t2v_util.security.RequestSecurityPage();", 180000);
    },
    RemoveCookies: function () {
        T2VForm.Post("Service/UserRoleManagerService.asmx/RemoveCookie", {}, function (response) { });
    }
};
t2v_util.valid = {
    IsPlusNumber: function (s) {
        var reg = /^\d+(\.\d+)?$/;
        if (reg.test(s)) return false;
        return true;
    },
    IsPlusInteger: function (s) {
        var reg = /^[0-9]\d*$/;
        if (reg.test(s)) return false;
        return true;
    },
    IsEmail: function (s) {
        var patrn = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        if (patrn.test(s)) return false
        return true
    },
    ConvertToJson: function (s) {
        s = s.replace(/(\\|\"|\')/g, "\\$1")
            .replace(/\n|\r|\t/g,
        function () {
            var a = arguments[0];
            return (a == '\n') ? '\\n' : ""
        });
        return s;
    },
    ConvertToResponse: function (s) {
        s = s.replace(/(\%)/g, "%25")
                    .replace(/(\#)/g, "%23")
                    .replace(/(\&)/g, "%26")
                    .replace(/(\=)/g, "%3D")
            .replace(/\n|\r|\t/g,
        function () {
            var a = arguments[0];
            return (a == '\n') ? '\\n' :
           (a == '\r') ? '\\r' :
           (a == '\t') ? '\\t' : ""
        });
        return s;
    },
    ConvertToUrlAndJson: function (s) {
        s = s.replace(/(\\|\"|\')/g, "\\\\\\$1")
                    .replace(/\n|\r|\t/g,
           function () {
               var a = arguments[0];
               return (a == '\n') ? '\\n' :
                    (a == '\r') ? '\\r' :
                    (a == '\t') ? '\\t' : ""
           });
        return s;
    }
    ,
    ConvertResponseToObj: function (response) {
        var browser = navigator.appName
        if (browser == "Netscape")
            return eval(response.documentElement.textContent);
        if (browser == "Microsoft Internet Explorer")
        {
            return eval($("string", response).text());
        }
    },
    ConvertToHtml: function(s){
       // 'a&lt; br&gt;b&lt; br&gt;c'
        s= s.replace(/\\n/g,"<br/>");
        //s= s.replace(/\\/g,"");
        s= s.replace(/<script>/g,"<text></text>").replace(/<\/script>/g,"<text></text>");
        //s= s.replace(/</script>/g,"");
        return s;
    },
    RemoveHtml: function (str) {
        return str.replace(/<\/?[^>]*>/g, '');
    },
};
t2v_util.culture = {
    SetCookie: function (language) {
        var Days = 30;
        var exp = new Date(); //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = "CurrentLanguage=" + language + ";path=/;"; //expires=" + exp.toGMTString();                
    },
    GetLanguage: function () {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split(";");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (arr[0] == "CurrentLanguage" || arr[0] == " CurrentLanguage")
                return arr[1];
        }
        return "en-us";
    }
};
t2v_util.t2vformat = {
    formatdatetime: function (datestring, formater) {
        var date_paramater = new Date(datestring);
        var year = date_paramater.getFullYear(); var month = date_paramater.getMonth(); var day = date_paramater.getDay();
        var hour = date_paramater.getHours(); var minute = date_paramater.getMinutes(); var second = date_paramater.getSeconds();
       var mm = (month < 10) ? '0' + month : month; var dd = (day < 10) ? '0' + day : day;
        var hh = (hour < 10) ? '0' + hour : hour; var mi = (minute < 10) ? '0' + minute : minute; var se = (second < 10) ? '0' + second : second;
       var se = (second < 10) ? '0' + second : second;
        switch (formater) {
            case "mm/dd/yyyy":
                return mm + "/" + dd + "/" + year;
                break;
            case "dd/mm/yyyy":
                return dd + "/" + mm + "/" + year;
                break;
            case "mm/dd/yyyy {0}":
                return mm + "/" + dd + "/" + year + " "+ hh + ":" + mi + ":" + se ;
                break;
            case "dd/mm/yyyy {0}":
                return dd + "/" + mm + "/" + year + " " + hh + ":" + mi + ":" + se;
                break;
            case "yyyy-mm-dd":
                return year + "-" + mm + "-" + dd;
                break;
            case "yyyy-mm-dd {0}":
                return year + "-" + mm + "-" + dd + " " + hh + ":" + mi + ":" + se;
                break;
            default:
                return mm + "/" + dd + "/" + year;
        }
    },
    getFormatMonth:function (month){
        var date = new Date();
        if(month == undefined || month == null)
            month = date.getMonth();
        switch(month){
            case 0:
                return "January";
                break;
            case 1:
                return "February";
                break;
            case 2:
                return "March";
                break;
            case 3:
                return "April";
                break;
            case 4:
                return "May";
                break;
            case 5:
                return "June";
                break;
            case 6:
                return "July";
                break;
            case 7:
                return "August";
                break;
            case 8:
                return "September";
                break;
            case 9:
                return "October";
                break;
            case 10:
                return "November";
                break;
            case 11:
                return "December";
                break;                                                                                                                        
        }
    }
};
t2v_util.t2vLoading = {
    ShowLoading: function (loadingtext) {
        if (loadingtext != undefined && loadingtext != "" && loadingtext != null) {
            $("#spanLoadingContent").text(loadingtext);
        }

        $("#divProcessLoading").show();
    },
    HideLoading: function () {
        $("#divProcessLoading").hide();
        $("#spanLoadingContent").text("Processing your request, please wait...");
    }
};
t2v_util.t2vmenu = {
    switchMenu: function(curr_id){
    

        //for(var i=0; i<total_num; i++){
        var el = $('#' + curr_id);
		    if(!el) return;

            el.toggle("slow");
            
            //el.animate({left:(offect.left+100)+"px",top:offect.top+"px"},500,function(){});
            /*
		    if(i == curr_id)
                if(el.css("display") == "none" || el.css("display") == undefined)
			        el.css("display","block");
                else
                    el.css("display","none");
		    else
			    el.css("display","none");
                */
	    //}
        
    },
};


