angular.module('app.controllers', [])
    .controller('HomeCtrl', ['$scope', '$timeout', '$http', '$window', 'transformRequestAsFormPost', '$location', '$rootScope', 'dialogs', function ($scope, $timeout, $http, $window, transformRequestAsFormPost, $location, $rootScope, dialogs) {
        $scope.rootsite = t2v_lib.history.GetRootPath();
        $scope.layout = "login-layout";
        $scope.user = { loginfail: false };
        $scope.reg = { loginfail: false, UserType:0 };
        $scope.logged = false;
        $scope.permissions = { scope: 'email' };
        $scope.moveQuestion = function () {
            if ($scope.registerForm.Email.$valid == false) {
                t2v_lib.animation.flash('#divUserName', 8, 10, 100);
                //return;
            } else {
                angular.element("#divUserName").animate({
                    marginLeft: "-418px",
                }, 800);
                angular.element("#divQuestion").animate({
                    marginLeft: "0px",
                }, 800, null, function () {
                });
            }
        };
        $scope.movePassword = function () {
            angular.element("#divQuestion").animate({
                marginLeft: "-418px",
            }, 800);
            angular.element("#divPassword").animate({
                marginLeft: "0px",
            }, 800, null, function () {
                angular.element("#txtPassword").focus();
            });
            
        };
        $scope.movePre = function () {
            angular.element("#divPassword").animate({
                marginLeft: "936px",
            }, 800);
            angular.element("#divQuestion").animate({
                marginLeft: "418px",
            }, 800);
            angular.element("#divUserName").animate({
                marginLeft: "0px",
            }, 800, null, function () {
            });
        };
        $scope.logOn = function () {
            if ($scope.user.Email == null && $scope.user.Password == null) {
                dialogs.notify('NetRebate!', "Please enter user name and password.");
                return;
            }
            $http.post($scope.rootsite+'/Account/logOn', $scope.user)
                .success(function (response) {
                    if (response.Code === "Sucess") {
                        $window.sessionStorage.setItem('usertype', response.UserType);
                        $window.sessionStorage.setItem('username', $scope.user.Email);
                        $window.sessionStorage.setItem('displayname', response.DisplayName);
                        $window.sessionStorage.setItem('code', response.hasConig);
                        $location.path("/DashBoard");
                    } else {
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
        $scope.register = function () {
            if ($scope.registerForm.$valid == false) {
                return;
            }
            else {
                $http.post('/Account/Register', $scope.reg)
                .success(function (response) {
                    if (response.Code === "Success") {
                        $scope.layout = "no-skin";
                        if($scope.reg.UserType == "0")
                            dlg = dialogs.notify('NetRebate!', '<div><h1>Thanks for signing up to NetRebate.</h1><br/>We\'ve sent the templates to your email to create your first claim.</div>');
                        else
                            dlg = dialogs.notify('NetRebate!', '<div><h1>Thanks for signing up to NetRebate.</h1><br/>We\'ve sent the templates to your email to review your first claim.</div>');
                    }
                    else if(response.Code === "Fail")
                        dialogs.notify('NetRebate!', response.Message);
                }).error(function (d, s, h, c) {
                    if (d != null) {
                        alert(d.message);
                    }
                    else {
                        alert("error");
                    }
                });
            }
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
    }])