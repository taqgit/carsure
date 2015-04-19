'use strict';

/**
 * @ngdoc function
 * @name carsureApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the carsureApp
 */
angular.module('carsureApp')
    .controller('LoginCtrl', function ($scope, alert, auth, $auth, $state, $stateParams, $timeout) {
        $scope.submit = function () {

            $auth.login({
                    email: $scope.email,
                    password: $scope.password
                })
                .then(function (res) {
                    var message = 'Thanks fpr coming back ' + res.data.client.email + '!';
                    if (!res.data.client.active)
                        message = 'Just a reminder, please email activate your account soon :)';
                    alert('success', 'Welcome', message);
                })
                .catch(handleError);
        };

        $scope.authenticate = function (provider) {
            $auth.authenticate(provider).then(function (res) {
                console.log('JSON After login -------------------------------> ' + JSON.stringify(res.data));
                console.log('Object After login -------------------------------> ' + res.data.client.email);
                //                $timeout(function () {
                //                    $state.go('apply', {
                //                        email: res.data.client.email
                //                    });
                //                }, 5);
                $timeout(function () {
                    $state.go('apply', {
                        client: res.data.client.email
                    })
                });
                alert('success', 'Welcome', 'Thanks for coming back ' + res.data.client.displayName + '!');
            }, handleError);
        }

        function handleError(err) {
            alert('warning', 'Something went wrong: (', err.message);
        }
    });