'use strict';

angular.module('carsureApp')
  .factory('authToken', function ($window) {
    var storage = $window.localStorage;
    var cachedToken;
    var clientToken = 'clientToken';
    var isAuthenticated = false;
    var authToken = {
        setToken: function (token) {
          cachedToken = token;
          storage.setItem(clientToken, token);
          isAuthenticated = true;
        },
        getToken: function(){
            if(!cachedToken)
                cachedToken = storage.getItem(clientToken);
            return cachedToken;
        },
        isAuthenticated: function(){
            return !!authToken.getToken();
        },
        removeToken: function() {
            cachedToken = null;
            storage.removeItem(clientToken);
            isAuthenticated = false;
        }
    }
    
    return authToken;
  });

