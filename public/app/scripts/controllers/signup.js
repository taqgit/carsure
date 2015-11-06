'use strict';

angular.module('carsureApp')
  .controller('SignupCtrl', function ($scope, $rootScope,alert, $auth) {
    $scope.submit = function(){
            $auth.signup({
                email: $scope.email, 
                password: $scope.password
            }).then(function (res) {
                alert('success', 'Account Created! ', 'Welcome, '+res.data.client.email+ '!Please email activate your account');
            })
            .catch(function(err){
                alert('warning', 'Oops! Could not sign you up :(', err.message);
            });
        }
});
