angular.module('app.controllers')
    .controller('UserCtrl', ['$scope', '$timeout', '$http', '$window', 'transformRequestAsFormPost', '$location', '$upload', '$rootScope', 'TypeEnum', 'dialogs', function ($scope, $timeout, $http, $window, transformRequestAsFormPost, $location, $upload, $rootScope, TypeEnum, dialogs) {
        $scope.showwelcome = "Welcome to user management form";
        $scope.layout = "no-skin";
        $scope.user = {};
        $scope.register = function () {
            if ($scope.registerForm.$valid == false) {
                return;
            }
            else {
                $http({
                    method: 'post',
                    url: '/Account/Register',
                    transformRequest: transformRequestAsFormPost,
                    data: $scope.registerModel
                }).success(function (data) {
                    if (data.logflag === "Success") {
                        $location.path("/checkemail");
                    }
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
        $scope.findPassword = function () {
            var dlg = dialogs.confirm();
            dlg.result.then(function (btn) {
                alert('Yes');
            }, function (btn) {
                alert('No');
            });
        }
    }]);