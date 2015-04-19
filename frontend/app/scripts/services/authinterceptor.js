'use strict';

/**
 * @ngdoc service
 * @name carsureApp.authInterceptor
 * @description
 * # authInterceptor
 * Factory in the carsureApp.
 */
angular.module('carsureApp')
    .factory('authInterceptor', function (authToken) {
        return {
            request: function (config) {
                var token = authToken.getToken();

                if (token)
                    config.headers.Authorization = 'Bearer ' + token;

                return config;
            },
            response: function (response) {
                return response;
            }
        };
    });