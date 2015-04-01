'use strict';

/**
 * @ngdoc function
 * @name carsureApp.controller:ApplyCtrl
 * @description
 * # ApplyCtrl
 * Controller of the carsureApp
 */
angular.module('carsureApp')
  .controller('ApplyCtrl', function ($scope, alert, $http, API_URL) {
    $scope.submit = function() {
        alert('success', 'Your application is being processed! ', 'Please wait, '+$scope.email+ ' for verification text at '+$scope.mobile+' ! You are colser to get your dream car');
        
    };
    
    $scope.sendText = function(){
        $http.post(API_URL+'apply', {email: $scope.email, mobile: $scope.mobile}).success(function(){
            console.log('On Blur');
        });  
    }
    
  });
