'use strict';

/**
 * @ngdoc function
 * @name carsureApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the carsureApp
 */
angular.module('carsureApp')
    .controller('MainCtrl', function ($scope, $state, $auth) {
        console.log('Scope isAuthenticated in Main Js ------------------- ' + $scope.isAuthenticated + ' auth isAuthenticated ----------------- ' + $auth.isAuthenticated);
        if ($scope.isAuthenticated)
            $state.go('apply');
        $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    });