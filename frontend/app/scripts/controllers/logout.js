'use strict';

/**
 * @ngdoc function
 * @name carsureApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the carsureApp
 */
angular.module('carsureApp')
  .controller('LogoutCtrl', function (authToken, $state) {
    authToken.removeToken();
    $state.go('main');
  });
