'use strict';

/**
 * @ngdoc overview
 * @name carsureApp
 * @description
 * # carsureApp
 *
 * Main module of the application.
 */
angular
    .module('carsureApp').config(function ($urlRouterProvider, $stateProvider, $httpProvider, $authProvider, API_URL) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
        //Remove later
            .state('test', {
                url: '/test',
                templateUrl: '/views/clients.html'
            })
            //    .state('stock', {
            //        url: '/partials/stock.html',
            //        templateUrl: '/views/partials/stock.html'
            //    })
            //End remove
            .state('main', {
                url: '/',
                templateUrl: '/views/main.html'
            })

        .state('register', {
            url: '/register',
            templateUrl: '/views/register.html'
        })

        .state('signup', {
                url: '/signup',
                templateUrl: '/views/signup.html',
                controller: 'SignupCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/views/login.html',
                controller: 'LoginCtrl'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutCtrl'
            })
            .state('apply', {
                url: '/apply/:client_id',
                templateUrl: '/views/apply.html',
                controller: 'ApplyCtrl'
            });


        $authProvider.loginUrl = API_URL + 'login';
        $authProvider.signupUrl = API_URL + 'signup';


        $authProvider.google({
            clientId: '120556145578-t99gv6vinikq4d684n56r0d1qei0mt1q.apps.googleusercontent.com',
            url: API_URL + 'auth/google'
        })


        $authProvider.facebook({
            clientId: '825544267499299',
            url: API_URL + 'auth/facebook'
        })

        $httpProvider.interceptors.push('authInterceptor');
    })
    .constant('API_URL', 'http://localhost:3000/')

.run(function ($window) {
    var params = $window.location.search.substring(1);
    if (params && $window.opener && $window.opener.location.origin === $window.location.origin) {
        var pair = params.split('=');
        var code = decodeURIComponent(pair[1]);
        $window.opener.postMessage(code, $window.location.origin);
    }
});