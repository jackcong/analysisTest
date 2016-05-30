angular.module('app.controllers')
    .controller('SharedCtrl', ['$scope', '$timeout', '$http', '$window', 'transformRequestAsFormPost', '$location', '$rootScope', 'TypeEnum', 'dialogs', function ($scope, $timeout, $http, $window, transformRequestAsFormPost, $location, $upload, $rootScope, TypeEnum, dialogs) {
        $scope.compares = [];
        $scope.userType = "";
        $scope.displayName = "";
        $scope.emailCount = 0;

        if (sessionStorage.getItem("usertype") == 0)
            $scope.userType = "Creator";
        else
            $scope.userType = "Reviewer";
        $scope.displayName = sessionStorage.getItem("displayname");
        $scope.logout = function () {
            $http.get('/Account/SignOut')
            .success(function (response) {
                if (response.Code === "Success") {
                    sessionStorage.clear();
                    $location.path('/index');
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
        $scope.GetUserInfo = function () {

        };
    }])
    .controller('StaticCtrl', ['$scope', '$timeout', '$http', '$window', 'transformRequestAsFormPost', '$location', '$upload', '$rootScope', 'TypeEnum', 'dialogs', function ($scope, $timeout, $http, $window, transformRequestAsFormPost, $location, $upload, $rootScope, TypeEnum, dialogs) {

    }])
    .controller('CommonCtrl', ['$scope', function ($scope) {
        $scope.navbarMaxWidth = true;
        $scope.navbarMinWidth = false;
        $scope.navbarColMax = true;
        $scope.navbarColMin = false;
        $scope.navbarText = false;
        $scope.pagemax = true;
        $scope.pagemin = false;
        $scope.CollapseMenu = function () {
                $scope.navbarMaxWidth = false;
                $scope.navbarMinWidth = true;
                $scope.navbarColMax = false;
                $scope.navbarColMin = true;
                $scope.navbarText = true;
                $scope.pagemax = false;
                $scope.pagemin = true;
        };
        $scope.ReversalMenu = function () {
            if ($scope.navbarMaxWidth) {
                $scope.navbarMaxWidth = false;
                $scope.navbarMinWidth = true;
                $scope.navbarColMax = false;
                $scope.navbarColMin = true;
                $scope.navbarText = true;
                $scope.pagemax = false;
                $scope.pagemin = true;
            }
            else {
                $scope.navbarMaxWidth = true;
                $scope.navbarMinWidth = false;
                $scope.navbarColMax = true;
                $scope.navbarColMin = false;
                $scope.navbarText = false;
                $scope.pagemax = true;
                $scope.pagemin = false;
            }
        };
    }]);