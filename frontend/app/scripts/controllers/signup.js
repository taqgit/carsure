'use strict';

/**
 * @ngdoc function
 * @name carsureApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the carsureApp
 */
angular.module('carsureApp')
  .controller('SignupCtrl', function ($scope, $rootScope, $http, alert, authToken, API_URL) {
    $scope.submit = function(){
        var url=API_URL+'signup';
        var client = {email: $scope.email, 
                      password: $scope.password
        };
        $http.post(url, client)
            .success(function(res){
                alert('success', 'Account Created! ', 'Welcome, '+res.client.email);
                authToken.setToken(res.token);
            })
            .error(function(err){
                alert('warning', 'Oops! Could not sign you up ', err.message);
            });    
        }
});
