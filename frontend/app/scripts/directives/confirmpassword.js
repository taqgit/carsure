'use strict';

angular.module('carsureApp')
  .directive('confirmpassword', function () {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelCtrl){
        function validateEqual(value){
            var valid = (value === scope.$eval(attrs.confirmpassword));
            ngModelCtrl.$setValidity('equal', valid);
            return valid? value: undefined;
        }
        ngModelCtrl.$parsers.push(validateEqual);
        ngModelCtrl.$formatters.push(validateEqual);
          
        scope.$watch(attrs.confirmpassword, function(){
            ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
        })
          
      }       
    };
  });
