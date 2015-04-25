'use strict';

angular.module('carsureApp')
    .controller('ResetPasswordCtrl', function ($scope, $rootScope, alert, $auth) {

        $scope.submit = function () {
            $http.post(API_URL + 'resetcreds', {
                email: $scope.email,
                password: $scope.password
            }).success(function () {
                console.log('Log him/her in after successful reset');
                $auth.login({
                        email: $scope.email,
                        password: $scope.password
                    })
                    .then(function (res) {
                        var message = 'Promise that you would'
                        't forget your password again  ' + res.data.client.email + '!';
                        goAndApply(res);
                        if (!res.data.client.active)
                            message = 'Just a reminder, please email activate your account soon :)';
                        alert('success', 'Welcome', message);
                    })
                    .catch(handleError);
            });
        }

        function goAndApply(res) {
            $rootScope.client = res.data.client;
            $timeout(function () {
                $state.go('apply')
            });
            $scope.client = res.data.client;
        }

    });