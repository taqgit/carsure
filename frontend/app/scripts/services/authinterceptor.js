'use strict';

/**
 * @ngdoc service
 * @name carsureApp.authInterceptor
 * @description
 * # authInterceptor
 * Factory in the carsureApp.
 */
angular.module('carsureApp')
  .factory('authInterceptor', function(authToken) {
    return {
        request: function(config) {
            var token = authToken.getToken();

            if (token)
                config.headers.Authorization = 'Bearer ' + token;
            console.log('In Request  ----------------------------------------- authToken '+authToken + ' token '+token);

            return config;
        },
        response: function(response) {
            console.log('In Response -----------------------------------------'+response.stack);
            return response;
        }
    };
});

