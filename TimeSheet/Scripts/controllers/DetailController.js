angular.module('app.controllers').controller('DetailCtrl', ['$scope','$location','DetailServices', function ($scope,$location,DetailServices) {

    $scope.TimeSheet = new Object();
    $scope.TimeSheet.TempCustomerName = "";
    $scope.TimeSheet.CategoryCustomerID = 0;
    $scope.TimeSheet.CategoryCustomerName = "";
    $scope.TimeSheet.TempCategoryName = "";
    $scope.TimeSheet.CategoryDetailID = 0;
    $scope.TimeSheet.CategoryDetailName = "";
    $scope.TimeSheet.ActHours = "";
    $scope.TimeSheet.Comment = "";
    $scope.TimeSheet.TypeDate = new Date();
    $scope.TimeSheet.TypeWeek = t2v_lib.DateCalculate.getWeek($scope.TimeSheet.TypeDate);
    $scope.isSaved = false;
    $scope.UserGroup = 0;
    $scope.TimeSheet.SummaryID = $scope.DetailID;

    $scope.DetailID = $location.path().split('/')[2]

    DetailServices.GetDetailData($scope.DetailID).then(function (summaryvalue) {
        //set 
        $scope.summary = JSON.parse(summaryvalue.summary);
        $scope.TimeSheet.SummaryID = $scope.summary.Id;
        $scope.DetailID = $scope.summary.Id;

        $scope.listcategory = JSON.parse(summaryvalue.category);
        $scope.timesheet = JSON.parse(summaryvalue.statistics);
        $scope.AnalysisWorker($scope.listcategory, $scope.timesheet);
    });

    $scope.AnalysisWorker = function (listcategory,timesheet)
    {
        //after get timesheet data ,we calculate item.
        $scope.projectlist = new Array();
        var AnalysisWorker = new Worker("Scripts/webworker/StatisticsAnalysis.js");
        AnalysisWorker.onmessage = function (evt) {
            $scope.$apply(function () { $scope.projectlist.push(evt.data); });
        };
        angular.forEach(listcategory, function (item) {
            var categoryArr = { "category": item, "timesheet": timesheet };
            AnalysisWorker.postMessage(categoryArr);
        });
    }

    $scope.AddNewTimeSheet = function () {
        $scope.clearTimeSheet();
        $scope.isSaved = false;
        $('#divMail').modal('show');
    };

    $scope.showComment = function (timesheetid) {
        DetailServices.GetCommentData(timesheetid).then(function (commentvalue) {
            $("#divCommentContent").html("");
            $("#divCommentContent").html(commentvalue.result);
            $('#divComment').modal('show');
        });
    };

    $scope.clearTimeSheet = function () {

        $scope.TimeSheet.TempCustomerName = "";
        $scope.TimeSheet.CategoryCustomerID = 0;
        $scope.TimeSheet.CategoryCustomerName = "";

        $scope.TimeSheet.TempCategoryName = "";
        $scope.TimeSheet.CategoryDetailID = 0;
        $scope.TimeSheet.CategoryDetailName = "";

        $scope.TimeSheet.ActHours = "";
        $scope.TimeSheet.Comment = "";
        $scope.TimeSheet.TypeDate = new Date();
        $scope.TimeSheet.TypeWeek = t2v_lib.DateCalculate.getWeek($scope.TimeSheet.TypeDate);
        $scope.TimeSheet.SummaryID = $scope.summary.Id;

    };

    $scope.setCategory = function ()
    {
        var detailObject = $scope.TimeSheet.TempCategoryName;
        $scope.TimeSheet.CategoryDetailID = detailObject.Id;
        $scope.TimeSheet.CategoryDetailName = detailObject.CategoryHeaderName + "-" + detailObject.CategoryDetailName;
        $scope.customers = detailObject.CategoryCustomers;
    };

    $scope.setCustomer = function () {
        var customerObject = $scope.TimeSheet.TempCustomerName;
        $scope.TimeSheet.CategoryCustomerID = customerObject.Id;
        $scope.TimeSheet.CategoryCustomerName = customerObject.CategoryCustomerName;
    };

    $scope.SaveTimeSheet = function () {
        if ($scope.timesheetform.$valid) {
            DetailServices.SaveTimeSheet($scope.TimeSheet).then(function (summaryvalue) {
                if (summaryvalue.result > 0) {
                    $scope.clearTimeSheet();

                    //reget the data after user input
                    DetailServices.GetDetailData($scope.DetailID).then(function (summaryvalue) {
                        //set 
                        $scope.summary = JSON.parse(summaryvalue.summary);
                        $scope.listcategory = JSON.parse(summaryvalue.category);
                        $scope.timesheet = JSON.parse(summaryvalue.statistics);
                        $scope.AnalysisWorker($scope.listcategory, $scope.timesheet);
                    });
                }
            });
        }
    };

    DetailServices.GetCategory().then(function (summaryvalue) {
        $scope.listcategoryforSelect = JSON.parse(summaryvalue.result);
    });

}]);