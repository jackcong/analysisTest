'use strict';

app.factory('DrawTable', ['$http', function ($http) {

    function DrawTable(divid, colInfo, url) {

        FetureV7Grid.myParam(colInfo, divid, 20, url, "", "");
        FetureV7Grid.showGrid();
    }
    return DrawTable;
}]);


app.directive('t2vdatatable', ['$http', 'DrawTable',
    function ($http, DrawTable) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs, ctrl) {
                //alert("123");
                var element = elem;
                var k = scope.header;
                DrawTable(element.attr("id"), k, "/DashBoard/GetList");
                //alert("456");
            }
        };
}]);

//app.factory('DrawPosTable', ['$http', function ($http) {

//    function DrawPosTable(divid, colInfo) {
//        FetureV7Grid.myParam(colInfo, divid, 20, "/Pos/GetList", "", "");
//        FetureV7Grid.showGrid();
//    }
//    return DrawPosTable;
//}]);



app.factory('DrawClaimTable', ['$http', function ($http) {

    function DrawClaimTable(divid, colInfo, batchNumber) {
        var param = '[{"columnName":"BatchNumber"'
                                        + ',"columnValue":"' + batchNumber + '","columnOperator":"cn"}]';
        FetureV7Grid.myParam(colInfo, divid, 20, "/Claim/GetList", param, "");
        FetureV7Grid.showGrid();
    }
    return DrawClaimTable;
}]);



Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var FetureV7Grid =
    {
        myParam: function (colInfo, divName, pageSize, servicesUrl, searchParam, sortName, afterOper, reduceWidth) {
            this.inCol = colInfo;
            this.divName = divName;
            this.pageSize = pageSize;
            this.columnName = "";
            this.displayName = "";
            this.currentPageIndex = 1;
            this.allCount = 0;
            this.searchParam = searchParam;
            this.isPostBack = false;
            this.pageCount = 0;
            this.servicesUrl = servicesUrl;
            this.sortName = sortName;
            this.sortOrder = "";
            this.postBackParam = "";

            this.lang = "en";
            this.outParam = "";
            this.outParamValue = "";
            this.checkArray = [];
            this.afterOper = afterOper;
            this.reduceWidth = reduceWidth;

            this.multiLanguage = {
                pageSizeBefore_en: "display", pageSizeBefore_fr: "display1", pageSizeAfter_en: "matches per page",
                pageSizeAfter_fr: "matches per page1", refeshData_en: "Refresh Data", refeshData_fr: "Refresh Data1", resetFilter_en:
            "Reset Filters", resetFilter_fr: "Reset Filters1", firstPage_en: "First", firstPage_fr: "First1", prePage_en: "Prev",
                prePage_fr: "Pre1", nextPage_en: "Next", nextPage_fr: "Next1", lastPage_en: "Last", lastPage_fr: "Last1", countPage_en: "Count",
                countPage_fr: "Count1", ofPage_en: "of", ofPage_fr: "of1", exportExcel_en: "Export To Excel", exportExcel_fr: "Export To Excel1"
            };

        },
        fillDropDown: function (columnName, fillServicesUrl) {
            var str = "";
            $.ajax({
                type: "post",
                url: fillServicesUrl, //get drop down data source
                data: { colName: columnName },
                dataType: "json",
                async: false,
                success: function (filldata) {
                    $(filldata).find("mytable").each(function (i) {
                        str += "<option value='" + $(this).find(columnName).text() + "'>" + $(this).find(columnName).text() + "</option>";
                    })
                },
                error: function (data, textStatus) {
                    //alert("error：" + textStatus);
                }
            });
            return str;
        },

        getSelectValue: function () {
            var selectValues = window.selectedChk;
            if (selectValues != ",") {
                selectValues = selectValues.replace(/(Chk)/g, "");
                return selectValues.substring(1, selectValues.length - 1);
            }
            else {
                return "";
            }
        },
        showGrid: function (fullSearchText) {
            var inCol = this.inCol;
            var divName = this.divName;
            var colName = "";
            var tempColName = "";
            var pageSize = this.pageSize;
            var currentPageIndex = this.currentPageIndex;
            var searchParam = this.searchParam;
            var isPostBack = this.isPostBack;
            var servicesUrl = this.servicesUrl;
            var sortName = this.sortName;
            var sortOrder = this.sortOrder;
            var disName = "";
            var afterOper = this.afterOper;
            //the select column
            for (var i = 0; i < inCol.length; i++) {
                if (inCol[i].columnName && !inCol[i].isHidden && inCol[i].disType != "checkbox") {
                    colName += inCol[i].columnName + ",";
                    disName += inCol[i]["disName_" + this.lang] + ",";
                }
                if (inCol[i].columnName && inCol[i].disType != "checkbox") {
                    tempColName += inCol[i].columnName + ",";
                }
            }
            tempColName = tempColName.substr(0, tempColName.length - 1);
            colName = colName.substr(0, colName.length - 1);
            disName = disName.substr(0, disName.length - 1);

            this.columnName = colName;
            this.displayName = disName;
            if (sortName == "") {
                sortName = "CreateDate";
            }
            if (sortOrder == "") {
                sortOrder = "desc";
            }
            $.ajax({
                type: "post",
                url: servicesUrl,
                //data: { currentPageIndex: currentPageIndex, pageSize: pageSize, sortName: sortName, sortOrder: sortOrder, SearchParam: searchParam, searchColumn: tempColName },
                data: { currentPageIndex: currentPageIndex, pageSize: pageSize, sortName: sortName, sortOrder: sortOrder, SearchParam: searchParam },
                dataType: "json",
                async: true,
                beforeSend: function () {
                    $("#" + divName).css("padding", "100px 0 0 400px");
                    $("#" + divName).html("<img src='/Content/LoginImg/LoadingContent.gif'/>");

                },
                success: function (mydata) {
                    $("#" + divName).css("padding", "0");
                    if (!isPostBack) {
                        FetureV7Grid.initHeadTable(divName);
                    }
                    if (searchParam != "") {
                        fullSearchText = JSON.parse(searchParam)[0].columnValue;
                    }
                    FetureV7Grid.parseXml(mydata, inCol, divName, fullSearchText);

                    if (afterOper != undefined)
                        afterOper(mydata);
                    this.outParam = "";
                    this.outParamValue = "";
                },
                error: function (data, textStatus) {
                    if (textStatus == "parsererror") {
                        window.location.href = "/Account/LogOn";
                    } else {
                        alert("error：" + textStatus);
                    }
                }
            });
        },
        couputePage: function (pageDirection) {
            var pageCount;

            pageCount = Math.ceil(this.allCount / this.pageSize);
            this.pageCount = pageCount;
            if (pageDirection == "first") {
                this.currentPageIndex = 1;
            }
            if (pageDirection == "last") {
                this.currentPageIndex = pageCount;
            }
            if (pageDirection == "up") {
                if (this.currentPageIndex <= 1) {
                    this.currentPageIndex = 1;
                }
                else {
                    this.currentPageIndex--;
                }
            }
            else if (pageDirection == "down") {

                if (this.currentPageIndex >= pageCount) {
                    this.currentPageIndex = pageCount;
                }
                else {
                    this.currentPageIndex++;
                }
            }

            FetureV7Grid.showGrid();
        },
        setOutSearchParam: function (searchparam, searchvalue) {
            this.outParam = searchparam;
            this.outParamValue = searchvalue;
            FetureV7Grid.composeSearchParam();
        },
        composeSearchParam: function () {

            this.postBackParam = "[";
            this.searchParam = "[";
            for (i = 0; i < this.inCol.length; i++) {
                if (this.inCol[i].isFilterControl && this.inCol[i].isFilterControl == 'true') {
                    if ($("#control" + this.inCol[i].columnName).val() != "") {
                        this.searchParam += "{columnName:\"" + this.inCol[i].columnName + "\",columnValue:\"" + t2v_util.valid.ConvertToJson($("#control" + this.inCol[i].columnName).val().replace(/'/g, "\'\'")) + "\",";
                        if (this.inCol[i].operatorType) {
                            this.searchParam += "columnOperator:\"" + t2v_util.valid.ConvertToJson(this.inCol[i].operatorType) + "\",isOutParam:\"0\"},";
                        }
                        else {
                            this.searchParam += "columnOperator:\"=\",isOutParam:\"0\"},";
                        }
                        this.postBackParam += "{\"controlName\":\"control" + this.inCol[i].columnName + "\",\"controlValue\":\"" + t2v_util.valid.ConvertToJson($("#control" + this.inCol[i].columnName).val().replace(/'/g, "\'\'")) + "\"},";
                    }
                }
            }
            if ($.trim(this.outParam) != "" && $.trim(this.outParamValue) != "") {
                var outpa = this.outParam.split(",");
                for (i = 0; i < outpa.length; i++) {
                    this.searchParam += "{columnName:\"" + outpa[i].toString() + "\",columnValue:\"" + t2v_util.valid.ConvertToJson(this.outParamValue.replace(/'/g, "\'\'")) + "\",columnOperator:\"like\",isOutParam:\"1\"},";
                }
            }
            if (this.postBackParam != "[") {
                this.postBackParam = this.postBackParam.substring(0, this.postBackParam.length - 1);
            }
            this.postBackParam += "]";
            this.postBackParam = eval(this.postBackParam);
            this.searchParam += "]";
            this.currentPageIndex = 1;
            FetureV7Grid.showGrid();
        },
        changePageSize: function (newPageSize) {
            this.pageSize = newPageSize;
            this.currentPageIndex = 1;
            FetureV7Grid.showGrid();
        },

        refreshGrid: function () {
            this.currentPageIndex = 1;
            FetureV7Grid.showGrid();
        },
        //init Head Table
        initHeadTable: function (divName) {

            /*
            $("#" + divName).parent().find("#headDiv").remove();
    
            var icolspan = 0;
            var isShowExportExcel = false;
            var ExHandler = null;
            for (i = 0; i < this.inCol.length; i++) 
            {
            if (this.inCol[i].isShowExportExcel) 
            {
            isShowExportExcel = true;
            ExHandler = this.inCol[i].Handler;
            continue;
            }
            icolspan++;
            }
            var str = "<table cellpadding='0' cellspecing='0' id='headerTable' class ='DWQ_Search_table'>";
            str += "<tr>";
            str += "<td>";
    
            //we annotation this change page count function
            //str += "<td colspan='" + icolspan + "'>&nbsp;&nbsp;" + eval("this.multiLanguage.pageSizeBefore_" + this.lang) + "&nbsp;&nbsp;<select class='inputtext02' style='width:45px;' onchange='FetureV7Grid.changePageSize(this.value);'><option value='10'>10</option><option value='20'>20</option><option value='30'>30</option></select>&nbsp;&nbsp;" + eval("this.multiLanguage.pageSizeAfter_" + this.lang) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' id='btnsearch' value='" + eval("this.multiLanguage.refeshData_" + this.lang) + "' class='btnLongButton' onclick='javascript:FetureV7Grid.composeSearchParam()' />";
            //str += "<input type='button' class='btnLongButton' value='" + eval("this.multiLanguage.resetFilter_" + this.lang) + "' onclick='javascript:FetureV7Grid.resetFilters()'>";
    
            if (isShowExportExcel) 
            {
            str += "<input type='button' value='" + eval("this.multiLanguage.exportExcel_" + this.lang) + "' class='btnBigButton' onclick='javascript:FetureV7Grid.processFun(" + ExHandler + ");' />";
            }
            str += "</td></tr>";
            str += "</table>";
            $("<div id='headDiv'>").html(str).insertBefore("#" + divName);
            */
        },
        resetFilters: function () {
            this.postBackParam = "";
            this.searchParam = "";
            FetureV7Grid.showGrid();
        },
        ClickRows: function (obj) {
            //obj.addClass("GridRowClick");
            obj.parent().find("tr").each(function (k, v) {
                if ($(v).attr("id") != obj.attr("id")) {
                    //$(v).removeClass("GridRowClick");
                }
            })

            //show queue info 
            //pass header header id
            //t2v_Queue.ShowQueueInfo(obj.children()[2].innerHTML);
        },
        sortColumn: function (sortColName, sortObj) {
            if (sortColName != "") {
                if (sortColName == this.sortName) {
                    if (this.sortOrder == "desc") {
                        this.sortOrder = "asc";
                    }
                    else {
                        this.sortOrder = "desc";
                    }
                }
                else {
                    this.sortName = sortColName;
                    this.sortOrder = "desc";
                }
            }
            this.currentPageIndex = 1;
            FetureV7Grid.showGrid();
        },
        processFun: function (fun) {
            fun();
        },
        processFunction: function (obj, fun, params) {

            var ary = params.split(",");
            var strReturn = "";
            for (var z = 0; z < ary.length; z++) {

                var objvalue = obj.parent().parent().find("[id=td" + ary[z] + "]");
                if (objvalue.length > 0) {
                    if (z != ary.length - 1) {
                        //strReturn += ary[z] + ":\"" + t2v_util.valid.ConvertToJson(objvalue.html()) + "\",";
                        //strReturn += "id:\"" + t2v_util.valid.ConvertToJson(objvalue.html()) + "\",";
                        strReturn += t2v_util.valid.RemoveHtml(objvalue.html().replace(/\,/g, "")) + ",";
                    }
                    else {
                        //strReturn += "id:\"" + t2v_util.valid.ConvertToJson(objvalue.html()) + "\"";
                        strReturn += t2v_util.valid.RemoveHtml(objvalue.html().replace(/\,/g, ""));
                    }
                }
            }
            //        strReturn += "}";
            //        strReturn = eval("(" + strReturn + ")");
            //strReturn = objvalue.html();
            fun(strReturn);
        },
        //Get param
        GetParam: function () {
            var myArray = new Array();
            myArray.push(this.searchParam);
            myArray.push(this.sortName);
            myArray.push(this.sortOrder);
            myArray.push(this.columnName);
            myArray.push(this.displayName);
            return myArray;
        },
        parseXml: function (mydata, inCol, divName, fullSearchText) {
            this.isPostBack = true;
            //var allCount = $(mydata).find("tablecount").find("allcount").text();
            var allCount = mydata.records
            this.allCount = allCount;
            this.pageCount = Math.ceil(this.allCount / this.pageSize);

            var outerTable = document.createElement("table");
            var outerTbody = document.createElement("tbody");
            outerTable.cellPadding = 0;
            outerTable.cellSpecing = 0;
            outerTable.className = "outertable";
            outerTable.style.width = "100%";
            var outerTr = document.createElement("tr");
            var outerTd = document.createElement("td");
            outerTd.style.cssText = "vertical-align:top";

            var mainDiv = document.createElement("div");
            mainDiv.id = "divOut";
            var mainTable = document.createElement("table");
            var mainTbody = document.createElement("tbody");
            mainTable.id = "mainTable";
            mainTable.cellPadding = 0;
            mainTable.cellSpecing = 0;

            //mainTable.className = "table table-bordered table-hover table-striped tablesorter";
            //mainTable.className = "table table-hover";
            mainTable.className = "table table-striped table-hover";// table-bordered
            //mainTable.style.cssText = "";

            var mainTr = document.createElement("tr");
            for (var i = 0; i < this.inCol.length; i++) {
                var mainTh = document.createElement("th");
                mainTh.align = "center";
                if (this.inCol[i].isShowExportExcel && this.inCol[i].isShowExportExcel == 'true') {
                    continue;
                }
                if (this.inCol[i].isSort && this.inCol[i].isSort == "true") {
                    if (this.inCol[i].isHidden) {
                        mainTh.style.cssText = "width:" + this.inCol[i].Width + "px;display:none";
                        mainTh.innerHTML = this.inCol[i]["disName_" + this.lang];
                    }
                    else {
                        if (this.inCol[i].columnName == this.sortName) {
                            if (this.sortOrder == "desc") {
                                mainTh.style.cssText = "width:" + this.inCol[i].Width + "px";
                                var mainImg = document.createElement("img");
                                mainImg.src = "/Content/images/icon_up.gif";
                                mainImg.border = 1;

                                $(mainTh).append("<a href='javascript:void(0);' class='gridLink' onclick='FetureV7Grid.sortColumn(\"" + this.inCol[i].columnName + "\",$(this))'>" + this.inCol[i]["disName_" + this.lang] + "&nbsp;&nbsp;</a>");
                                $(mainTh).append(mainImg);
                                mainImg = null;
                            }
                            else if (this.sortOrder == "asc") {
                                mainTh.style.cssText = "width:" + this.inCol[i].Width + "px";
                                var mainImg = document.createElement("img");
                                mainImg.src = "/Content/images/incon_down.gif";
                                mainImg.border = 0;

                                $(mainTh).append("<a href='javascript:void(0);' class='gridLink' onclick='FetureV7Grid.sortColumn(\"" + this.inCol[i].columnName + "\",$(this))'>" + this.inCol[i]["disName_" + this.lang] + "&nbsp;&nbsp;</a>")
                                $(mainTh).append(mainImg);
                                mainA = null;
                                mainImg = null;
                            }
                        }
                        else {//can sort column
                            mainTh.style.cssText = "width:" + this.inCol[i].Width + "px";
                            $(mainTh).append("<a href='javascript:void(0);' class='gridLink' onclick='FetureV7Grid.sortColumn(\"" + this.inCol[i].columnName + "\",$(this))'>" + this.inCol[i]["disName_" + this.lang] + "</a>");
                            mainA = null;
                        }
                    }
                }
                else {
                    if (this.inCol[i].isHidden) {
                        mainTh.style.cssText = "width:" + this.inCol[i].Width + "px;display:none";
                        mainTh.innerHTML = this.inCol[i]["disName_" + this.lang];
                    }
                    else {

                        if (this.inCol[i].disType == "checkbox") {

                            mainTh.style.cssText = "width:" + this.inCol[i].Width + "px;text-align:center;";
                            var textCheck = document.createElement("input");
                            textCheck.type = "checkbox";
                            textCheck.id = "ChkAll";

                            $(textCheck).click(function () {

                                if ($(this).attr("checked") == "checked") {
                                    $(".DWQ_Results_table").find("input[type=checkbox]").each(function () {
                                        if ($(this).attr("checked") != "checked") {
                                            $(this).attr("checked", "checked");
                                            var key = parseInt($(this).attr("key"));
                                            if (FetureV7Grid.checkArray.indexOf(key) == -1) {
                                                FetureV7Grid.checkArray.push(key);
                                            }
                                        }
                                    });
                                }
                                else {
                                    $(".DWQ_Results_table").find("input[type=checkbox]").each(function () {
                                        if ($(this).attr("checked") == "checked") {
                                            $(this).removeAttr("checked");
                                            var key = parseInt($(this).attr("key"));
                                            var keyIndex = FetureV7Grid.checkArray.indexOf(key);
                                            if (keyIndex != -1) {
                                                FetureV7Grid.checkArray.splice(keyIndex, 1);
                                            }
                                        }
                                    });
                                }
                            });
                            mainTh.appendChild(textCheck);
                        }
                        else {
                            mainTh.style.cssText = "width:" + this.inCol[i].Width + "px";
                            mainTh.innerHTML = this.inCol[i]["disName_" + this.lang];
                        }
                    }
                }
                mainTr.appendChild(mainTh);
            }
            mainTbody.appendChild(mainTr);

            //init head
            if (this.inCol.length > 0) {
                var detialTr = document.createElement("tr");
                for (i = 0; i < this.inCol.length; i++) {
                    var detialTd = document.createElement("td");
                    if (this.inCol[i].isShowExportExcel && this.inCol[i].isShowExportExcel == 'true') {
                        continue;
                    }
                    if (this.inCol[i].isHidden) {
                        detialTd.className = "gridheadtd";
                        detialTd.id = "tdHead" + i;
                        detialTd.style.cssText = "display:none";
                    }
                    else {
                        detialTd.className = "gridheadtd";
                        detialTd.id = "tdHead" + i;
                    }
                    if (this.inCol[i].isFilterControl && this.inCol[i].isFilterControl == 'true') {

                        if (this.inCol[i].filterControlType == "dropdownlist") {
                            //onchange='FetureV7Grid.composeSearchParam();'
                            var detialSelect = "<select class='inputtext02' id='control" + this.inCol[i].columnName + "'>";
                            detialSelect += "<option value=''>--Select--</option>";
                            detialSelect += FetureV7Grid.fillDropDown(this.inCol[i].columnName, this.inCol[i].fillDataSource);
                            detialSelect += "</select>";
                            $(detialTd).append($(detialSelect));
                        }
                        else if (this.inCol[i].filterControlType == "text") {

                            var inputText = "<input type='text' class='inputtext01' id='control" + this.inCol[i].columnName + "' />";
                            $(detialTd).append($(inputText));
                        }
                        else {
                            var inputText = "<input type='text' class='inputtext01' id='control" + this.inCol[i].columnName + "' />";
                            $(detialTd).append($(inputText));
                        }
                    }
                    detialTr.appendChild(detialTd);
                    detialTd = null;
                }
                //2012-12-7 remove header by jack
                //mainTbody.appendChild(detialTr);
            }

            if (typeof (mydata.rows) == "string") {
                mydata.rows = eval(mydata.rows);
            }

            for (var j = 0; j < mydata.rows.length; j++) {

                var textTr = document.createElement("tr");
                textTr.id = "tr" + j;
                if (j % 2 == 1) {
                    textTr.className = "erow";
                }
                $(textTr).click(function () {
                    FetureV7Grid.ClickRows($(this));
                });

                for (i = 0; i < inCol.length; i++) {
                    var textTd = document.createElement("td");
                    textTd.id = "td" + inCol[i].columnName;
                    if (inCol[i].isShowExportExcel && inCol[i].isShowExportExcel == 'true') {
                        continue;
                    }
                    if (inCol[i].isHidden) {
                        textTd.style.cssText = "display:none";
                    }
                    else {
                        if (inCol[i].align) {
                            textTd.align = inCol[i].align;
                        }
                        else {
                            textTd.align = "left";
                        }

                        if (inCol[i].BackGroundImg) {

                            textTd.style.cssText = "background:url(" + inCol[i].BackGroundImg + ")";
                        }
                    }

                    if (inCol[i].disType == "a") {
                        if (inCol[i].isSpecial == "true") {
                            $(textTd).append("<a href='javascript:void(0);' onclick=\"" + mydata.rows[j]["strOnclick"] + "\"><i class='ace-icon fa fa-pencil blue'></i></a>");
                        }
                        else {
                            if (inCol[i].gridUsedFor != undefined && inCol[i].gridUsedFor != "") {
                                var arrayList = inCol[i].linkparam.split(',');
                                var dx = inCol[i].columnName;
                                var dxd = mydata.rows[j][arrayList[0]] == null ? "" : mydata.rows[j][arrayList[0]];

                                $(textTd).append("<a href='#/" + inCol[i].gridUsedFor + "/" + dxd + "' onclick='javascript:FetureV7Grid.processFunction($(this)," + inCol[i].onclickFunction + ",\"" + inCol[i].linkparam + "\");'><i class='ace-icon fa fa-pencil blue'></i></a>");
                            }
                            else {
                                $(textTd).append("<a href='javascript:void(0);' class='btn btn-minier btn-info' onclick='javascript:FetureV7Grid.processFunction($(this)," + inCol[i].onclickFunction + ",\"" + inCol[i].linkparam + "\");'><i class='ace-icon fa fa-pencil blue'></i></a>");
                            }
                        }
                    }
                    else if (inCol[i].disType == "checkbox") {

                        textTd.style.cssText = "text-align:center;";
                        var textCheck = document.createElement("input");
                        textCheck.type = "checkbox";
                        var keyColumn = inCol[i].keyColumn;
                        var keyValue = parseInt(mydata.rows[j][keyColumn]);
                        var dx = inCol[i].columnName;
                        var dxd = mydata.rows[j][dx] == null ? "" : mydata.rows[j][dx];
                        textCheck.id = "Chk" + dxd;

                        $(textCheck).attr("key", keyValue);

                        if (this.checkArray.indexOf(keyValue) != -1) {
                            $(textCheck).attr("checked", "checked");
                        }

                        $(textCheck).click(function () {
                            if ($(this).attr("checked") == "checked") {
                                if (FetureV7Grid.checkArray.indexOf(parseInt($(this).attr("key"))) == -1) {
                                    FetureV7Grid.checkArray.push(parseInt($(this).attr("key")));
                                }
                            }
                            else {
                                var indexKey = FetureV7Grid.checkArray.indexOf(parseInt($(this).attr("key")));
                                if (indexKey != -1) {
                                    FetureV7Grid.checkArray.splice(indexKey, 1);
                                }
                            }
                        });
                        textTd.appendChild(textCheck);
                    }
                    else if (this.inCol[i].disType == "date") {
                        var dx = inCol[i].columnName;
                        var dxd = mydata.rows[j][dx] == null ? "" : mydata.rows[j][dx];
                        var currdate = dxd == "" ? "" : new Date(dxd).Format(this.inCol[i].dateFormat);;
                        textTd.innerHTML = currdate;
                        //Peter Sun change to bold charactor on searching
                    }
                    else if (inCol[i].disType == "text") {

                        var dx = inCol[i].columnName;
                        var dxd = "";
                        if (dx.indexOf(".") > 0) {
                            var arrayOfParamater = dx.split('.');
                            var dxd = mydata.rows[j];
                            for (m = 0; m < arrayOfParamater.length; m++) {
                                dxd = dxd[arrayOfParamater[m]] == null ? "" : dxd[arrayOfParamater[m]];
                            }
                        }
                        else {
                            dxd = mydata.rows[j][dx] == null ? "" : mydata.rows[j][dx];
                        }

                        if (inCol[i].decimal) {
                            if (!isNaN(parseFloat(dxd))) {
                                dxd = parseFloat(dxd).toFixed(2);
                            }
                        }

                        var dxdHtml = "";
                        //Peter Sun change to bold charactor on searching
                        if (fullSearchText != undefined && fullSearchText != "") {
                            var matchString = dxd.toString().match(new RegExp(fullSearchText, 'gi'));
                            if (matchString != null) {
                                for (var k = 0; k < matchString.length; k++) {
                                    dxdHtml = dxd.toString().replace(new RegExp(matchString[k], 'g'), "<b>" + matchString[k] + "</b>");
                                }
                            }
                            else {
                                dxdHtml = dxd;
                            }
                        }
                        else
                            dxdHtml = dxd;
                        textTd.innerHTML = dxdHtml;
                    }
                    else if (inCol[i].disType == "img") {
                        var statusParam = eval(inCol[i].statusParam);
                        for (x = 0; x < statusParam.length; x++) {
                            if ($(this).find(inCol[i].columnName).text() == statusParam[x].status) {
                                var textImg = document.createElement("img");
                                textImg.src = statusParam[x].disImg;
                                textImg.border = 0;
                                textTd.appendChild(textImg);
                            }
                        }
                    }
                    else if (inCol[i].disType == "aText") {

                        $(textTd).attr("class", inCol[i].class);

                        var dx = inCol[i].columnName;
                        var dxd = mydata.rows[j][dx] == null ? "" : mydata.rows[j][dx];
                        var dxdHtml = "";
                        //Peter Sun change to bold charactor on searching
                        if (fullSearchText != undefined && fullSearchText != "") {
                            var matchString = dxd.toString().match(new RegExp(fullSearchText, 'gi'));
                            if (matchString != null) {
                                for (var k = 0; k < matchString.length; k++) {
                                    dxdHtml = dxd.toString().replace(new RegExp(matchString[k], 'g'), "<b>" + matchString[k] + "</b>");
                                }
                            }
                            else {
                                dxdHtml = dxd;
                            }
                        }
                        else {
                            dxdHtml = dxd;
                        }

                        $(textTd).append("<span id='spanText' style='width:100%;cursor: pointer;color:blue;text-decoration:underline;' onclick='javascript:FetureV7Grid.processFunction($(this)," + inCol[i].onclickFunction + ",\"" + inCol[i].linkparam + "\");'>" + dxdHtml + "</span>");
                    }
                    else if (inCol[i].disType == "originalA") {
                        $(textTd).attr("class", inCol[i].class);


                        $(textTd).attr("class", inCol[i].class);

                        var dx = inCol[i].columnName;
                        var dxd = mydata.rows[j][dx] == null ? "" : mydata.rows[j][dx];
                        var dxdHtml = "";

                        if (fullSearchText != undefined && fullSearchText != "") {
                            var matchString = dxd.toString().match(new RegExp(fullSearchText, 'gi'));
                            if (matchString != null) {
                                for (var k = 0; k < matchString.length; k++) {
                                    dxdHtml = dxd.toString().replace(new RegExp(matchString[k], 'g'), "<b>" + matchString[k] + "</b>");
                                }
                            }
                            else {
                                dxdHtml = dxd;
                            }
                        }
                        else {
                            dxdHtml = dxd;
                        }

                        $(textTd).append("<a style='background-image:none;cursor:pointer' onclick=\"" + mydata.rows[j]["strOnclick"] + "\">" + dxdHtml + "</a>");

                    }
                    else {
                        if (inCol[i].columnName) {
                            textTd.innerHTML = $(this).find(inCol[i].columnName).text();
                        }
                    }
                    textTr.appendChild(textTd);
                    textTd = null;
                }
                mainTbody.appendChild(textTr);
            }
            var icolspan = 0;
            for (var i = 0; i < this.inCol.length; i++) {
                if (inCol[i].columnName) {
                    icolspan++;
                }
            }

            var pageTable = document.createElement("table");
            var pageBody = document.createElement("tbody");
            pageTable.className = "Gird_Footer";
            var pageTr = document.createElement("tr");
            var pageTd = document.createElement("td");
            pageTd.align = "left";
            //pageTd.id = "tdfooter";
            var tolpagesize = parseInt(this.allCount) % parseInt(this.pageSize) == 0 ? parseInt(this.allCount / this.pageSize) : (parseInt(this.allCount / this.pageSize) + 1);
            $(pageTd).append("<span>Page: " + this.currentPageIndex + "/" + tolpagesize + " &nbsp;</span>");
            $(pageTd).append("<input type='hidden' id='currentPage' value='" + this.currentPageIndex + "'/>");
            $(pageTd).append(strHtml);

            var pageTd1 = document.createElement("td");
            pageTd1.align = "right";
            var strHtml = "<ul class='pagination'>";
            var prevDisabled = this.currentPageIndex == 1 ? "disabled" : "";
            strHtml += "<li class='paginate_button previous " + prevDisabled + "' onclick='javascript:FetureV7Grid.couputePage(\"first\")'><a href='javascript:void(0)'>" +
                            eval("this.multiLanguage.firstPage_" + this.lang) + "</a></li>";
            strHtml += "<li class='paginate_button previous " + prevDisabled + "' onclick='javascript:FetureV7Grid.couputePage(\"up\")'><a href='javascript:void(0)'>" +
                            eval("this.multiLanguage.prePage_" + this.lang) + "</a></li>";
            var nextDisabled = this.currentPageIndex == tolpagesize ? "disabled" : "";
            strHtml += "<li class='paginate_button next " + nextDisabled + "' onclick='javascript:FetureV7Grid.couputePage(\"down\")'><a href='javascript:void(0)'>" +
                            eval("this.multiLanguage.nextPage_" + this.lang) + "</a></li>";
            strHtml += "<li class='paginate_button next " + nextDisabled + "' onclick='javascript:FetureV7Grid.couputePage(\"last\")'><a href='javascript:void(0)'>" +
                            eval("this.multiLanguage.lastPage_" + this.lang) + "</a></li>";
            strHtml += "</ul>";
            $(pageTd1).append(strHtml);
            pageTr.appendChild(pageTd);
            pageTr.appendChild(pageTd1);
            pageBody.appendChild(pageTr);
            pageTable.appendChild(pageBody);

            mainTable.appendChild(mainTbody);
            mainDiv.appendChild(mainTable);
            outerTd.appendChild(mainDiv);
            outerTr.appendChild(outerTd);
            outerTbody.appendChild(outerTr);
            outerTable.appendChild(outerTbody);

            $("#" + divName).empty();

            $("#" + divName).append($("<div id='headDiv'>").html(pageTable));
            $("#" + divName).append(outerTable);
            

            //var divHeight;
            //divHeight = $(window).height() - 180;

            //var divWidth = $(window).width() - 220; // $(windows).screen.width() - 220px;
           
            //if (this.reduceWidth) {
            //    divWidth = divWidth - this.reduceWidth;
            //}
            //divWidth = 200;
            //mainDiv.style.cssText = "overflow:auto;overflow-x:auto;overflow-y:auto;height:" + divHeight + "px; width:" + divWidth + "px;";
            mainDiv.style.cssText = "overflow:auto;overflow-x:auto;overflow-y:auto;height:100%; width:100%";

            if ($("#mainTable").find("tr").length == 1)
            {
                $("#mainTable").parent().parent().html("<div style='text-align: center; padding-top:200px;'><span style='font-family: Verdana; font-size: 20px; font-weight: bold; color: #666'>No Result Found</span></div>");
                $("#headDiv").html("");
            }
            if (this.postBackParam != "")
            {
                for (i = 0; i < this.postBackParam.length; i++)
                {
                    $("#" + this.postBackParam[i].controlName).val(this.postBackParam[i].controlValue);
                }
            }
            //$("#divMainPageDiv").css("width", divWidth + "px");
        }
    }