'use strict';

/**
 * @ngdoc function
 * @name carsureApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the carsureApp
 */
angular.module('carsureApp')
    .controller('LoginCtrl', function ($scope, alert, auth, $auth, $state, $stateParams, $timeout, $rootScope) {
        function goAndApply(res) {
            $rootScope.client = res.data.client;
            $timeout(function () {
                $state.go('apply')
            });
            $scope.client = res.data.client;
        }
        $scope.submit = function () {

            $auth.login({
                    email: $scope.email,
                    password: $scope.password
                })
                .then(function (res) {
                    var message = 'Thanks fpr coming back ' + res.data.client.email + '!';
                    goAndApply(res);
                    if (!res.data.client.active)
                        message = 'Just a reminder, please email activate your account soon :)';
                    alert('success', 'Welcome', message);
                })
                .catch(handleError);
        };

        $scope.authenticate = function (provider) {
            $auth.authenticate(provider).then(function (res) {
                goAndApply(res);
                alert('success', 'Welcome', 'Thanks for coming back ' + res.data.client.displayName + '!');
            }, handleError);
        }

        function handleError(err) {
            alert('warning', 'Something went wrong: (', err.message);
        }
    });