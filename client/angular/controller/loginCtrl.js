ZapplApp.controller('loginCtrl', function ($scope, $rootScope, $stateParams, $state, $window, $http, LoginService) {
    $state.go('/Home');
    $scope.verifyUser = function () {
        var path = $window.location.origin;
        var browserDeviceId = '';
        var json = 'https://api.ipify.org?format=json';
        $http.get(json).then(function (result) {
            browserDeviceId = result.data.ip;
            if ($scope.name !== undefined && $scope.name !== null && $scope.name !== '' && $scope.password !== undefined && $scope.password !== null && $scope.password !== '') {
                $scope.name = $scope.name.toLowerCase();
                var username = btoa($scope.name);
                var password = btoa($scope.password);
                var rep = LoginService.login(username, password, 3600, browserDeviceId);
                rep.then(function (data) {
                    if (data.data !== undefined && data.data !== null && data.data !== '') {
                        localStorage.setItem('username', $scope.name);
                        localStorage.setItem('loginToken', data.data.token);
                        localStorage.setItem('nsfw', data.data.nsfw);
                        localStorage.setItem('publicActiveKey', data.data.publicActiveKey);
                        $rootScope.tokenValue = data.data.token;
                        localStorage.setItem('votingWeight', data.data.votingWeight);
                        localStorage.setItem('privatePosting', data.data.privatePosting);
                        console.log('$window.location.pathname',$window.location.pathname)
                        if ($window.location.pathname !== '/') {
                            window.location = path + "/Home";
                            // $window.location.reload();
                            // window.location = path + "/" + $window.location.pathname;
                        }
                        else {
                            window.location = path + "/Home";
                        }
                    }
                }, function (err) {
                    console.log('err', err);
                    $scope.errorMessage = 'Username or Password do not match';
                });
            }
            else {
                $scope.errorMessage = 'Please Enter Both Fields';
            }
        }, function (e) {
            $scope.errorMessage = 'Please Turn OFF your Ad blocker';
        });
    };
});
