'use strict';

angular.module('carsureApp')
    .controller('ResetcredsCtrl', function ($scope, $rootScope, alert, $auth, API_URL, $http, $timeout, $state) {

//        $scope.submit = function () {
        //            $http.post(API_URL + 'resetcreds', {
        //                email: $scope.email,
        //                password: $scope.password
        //            }).success(function () {
        //                console.log('Log him/her in after successful reset');
        //                $auth.login({
        //                        email: $scope.email,
        //                        password: $scope.password
        //                    })
        //                    //                    .then(function (res) {
        //                    //                        var message = 'Promise that you would'
        //                    //                        't forget your password again  ' + res.data.client.email + '!';
        //                    //                        goAndApply(res);
        //                    //                        if (!res.data.client.active)
        //                    //                            message = 'Just a reminder, please email activate your account soon :)';
        //                    //                        alert('success', 'Welcome', message);
        //                    //                    })
        //                    //                    .catch(handleError);
        //            });
        //        }
        //
        //        function goAndApply(res) {
        //            $rootScope.client = res.data.client;
        //            $timeout(function () {
        //                $state.go('apply')
        //            });
        //            $scope.client = res.data.client;
        //        }
        //
        //        function handleError(err) {
        //            alert('warning', 'Something went wrong: (', err.message);
        //        }

    });