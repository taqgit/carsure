'use strict';

/**
 * @ngdoc function
 * @name carsureApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the carsureApp
 */
angular.module('carsureApp')
  .controller('HeaderCtrl', function ($scope, authToken) {
    $scope.isAuthenticated = authToken.isAuthenticated;
  });
