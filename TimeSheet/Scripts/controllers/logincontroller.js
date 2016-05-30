angular.module('app.controllers')
    .controller('LoginCtrl', ['$scope', '$timeout', '$http', '$window', 'transformRequestAsFormPost', '$location', '$upload', '$rootScope', 'TypeEnum', 'dialogs', function ($scope, $timeout, $http, $window, transformRequestAsFormPost, $location, $upload, $rootScope, TypeEnum, dialogs) {
        $scope.showwelcome = "Welcome to Login form";
        $scope.layout = "login-layout blur-login";
        $scope.user = {};
        $scope.registerModel = {};
        $scope.logOnEnter = function (keyEvent) {
            if (keyEvent.which === 13)
                $scope.logOn();
        }
        $scope.logOn = function () {
            $http({
                method: 'post',
                url: '/Account/LogOn',
                transformRequest: transformRequestAsFormPost,
                data: $scope.user
            }).success(function (response) {
                if (response.Code === "Sucess") {
                    $window.sessionStorage.setItem('usertype', response.UserType);
                    $window.sessionStorage.setItem('username', $scope.user.Email);
                    $window.sessionStorage.setItem('displayname', response.DisplayName);
                    if ($location.search().returnUrl != '' && $location.search().returnUrl != undefined && $location.search().returnUrl != 'login')
                        $location.path('/' + $location.search().returnUrl);
                    else
                        $location.path('/DashBoard');
                }
                else {
                    dialogs.notify('NetRebate!', response.logflag);
                }
            }).error(function (d, s, h, c) {
                if (d != null) {
                    alert(d.message);
                }
                else {
                    alert("error");
                }
            });
        };
        app.directive('ngBlur', function () {
            return function (scope, elem, attrs) {
                elem.bind('blur', function () {
                    scope.$apply(attrs.ngBlur);
                });
            };
        });
        $scope.CheckUserExists = function () {
            //alert("blur");
            $.ajax({
                url: '/Account/CheckUserExists',
                type: 'post',
                async: true,
                data: $scope.registerModel,
                success: function (data, status, jqXhr) {
                    //$scope.InitAttachType();
                    //$("#fine-uploader-left").fineUploader('setParams', { 'ProjectID': $scope.quote.QuoteID, 'AttachType': $("#selAttachType").val(), 'ConfigID': $("#selConfigID").val() });
                    if (data.status == "Error occur") {
                        alert("User already exists.");
                        $scope.registerModel.UserName = "";
                    }
                }.error(function (d, s, h, c) {
                    if (d != null) {
                        alert(d.message);
                    }
                    else {
                        alert("error");
                    }
                })
            })
        };
        $scope.findPassword = function () {
            var dlg = dialogs.confirm();
            dlg.result.then(function (btn) {
                //alert('Yes');
                $.ajax({
                    url: '/Account/findPassword',
                    type: 'post',
                    async: false,
                    data: $scope.registerModel,
                    success: function (data, status, jqXhr) {
                        if (data.status == "Error occur") {
                            alert("Email already exists.");
                            $scope.registerModel.Email = "";
                        }
                        else {
                            alert("Please find your password in your email.");
                            top.location.reload();
                        }
                    },
                    error: function (data, status) {
                        t2v_login_util.t2valert("Email doesn't exist.");
                    }
                });
            }, function (btn) {
                alert('No');
            })
        };
    }]);
