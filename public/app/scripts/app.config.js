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
    .module('carsureApp').config(function ($urlRouterProvider, $stateProvider, $httpProvider, $authProvider, $locationProvider, API_URL) {
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);

        $stateProvider
        //Remove later
            .state('test', {
                url: '/test',
                templateUrl: 'app/views/clients.html'
            })
            //    .state('stock', {
            //        url: '/partials/stock.html',
            //        templateUrl: 'app/views/partials/stock.html'
            //    })
            //End remove
            .state('main', {
                url: '/',
                templateUrl: 'app/views/main.html'
            })

        .state('register', {
            url: '/register',
            templateUrl: 'app/views/register.html'
        })

        .state('signup', {
                url: '/signup',
                templateUrl: 'app/views/signup.html',
                controller: 'SignupCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/views/login.html',
                controller: 'LoginCtrl'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutCtrl'
            })
            .state('apply', {
                url: '/apply',
                templateUrl: 'app/views/apply.html',
                controller: 'ApplyCtrl'
            })
            .state('resetcreds', {
                url: '/resetcreds',
                templateUrl: 'app/views/resetcreds.html',
                controller: 'ResetPasswordCtrl'
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

.constant('API_URL', 'http://www.carsure.biz/')

.run(function ($window) {
    var params = $window.location.search.substring(1);
    if (params && $window.opener && $window.opener.location.origin === $window.location.origin) {
        var pair = params.split('=');
        var code = decodeURIComponent(pair[1]);
        $window.opener.postMessage(code, $window.location.origin);
    }
});