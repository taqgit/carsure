'use strict';

angular.module('carsureApp').service('auth', function auth($http, API_URL, authToken, $state, $window, $q) {
        
        function authSuccessful(res){
            authToken.setToken(res.token);
            $state.go('main');
        }

        this.login = function(email, password) {
            return $http.post(API_URL + 'login', {
                email: email,
                password: password
            }).success(authSuccessful);
        }
        
        this.signup = function(email, password) {
            return $http.post(API_URL + 'signup', {
                email: email,
                password: password
            }).success(authSuccessful);
        } 
        
        var urlBuilder = [];
        var clientId = '120556145578-t99gv6vinikq4d684n56r0d1qei0mt1q.apps.googleusercontent.com';        

	   urlBuilder.push('response_type=code',
            'client_id=' + clientId,
            'redirect_uri=' + window.location.origin,
            'scope=profile email')
    
        
        this.googleAuth = function () {
            console.log(" here " );
            var url = "https://accounts.google.com/o/oauth2/auth?" + urlBuilder.join('&');
            var options = 'width=500, height=500, left=' + ($window.outerWidth -500) / 2 + ',top=' + ($window.outerHeight - 500) / 2.5;
            
            var deferred = $q.defer();
            var popup = $window.open(url, '', options);
            $window.focus();
            $window.addEventListener('message', function(event){
                if(event.origin === $window.location.origin) {
                    console.log('event.data '+event.data);
                    var code = event.data;
                    popup.close();
                    
                    $http.post(API_URL + 'auth/google', {
                        code: code,
                        clientId: clientId,
                        redirectUri: window.location.origin
                    }).success(function (jwt) {
                        authSuccessful(jwt);
                        deferred.resolve(jwt);
                    });
                }
            });
            
            return deferred.promise;
        }
        
    
  });
