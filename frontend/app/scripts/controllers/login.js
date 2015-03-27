'use strict';

/**
 * @ngdoc function
 * @name carsureApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the carsureApp
 */
angular.module('carsureApp')
  .controller('LoginCtrl', function ($scope, $http, API_URL, alert, authToken) {
    $scope.submit = function(){
        var url=API_URL+'login';
        var client = {email: $scope.email, 
                      password: $scope.password
        };
        console.log('client -> '+client);
        $http.post(url, client)
            .success(function(res){
                alert('success', 'Logged in! ', 'Welcome, '+res.client.email);
                authToken.setToken(res.token);
            })
            .error(function(err){
                alert('warning', 'Oops!', 'Could not log you in');
            });    
        }
  });
