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
  .module('carsureApp').config(function($urlRouterProvider, $stateProvider, $httpProvider){
    $urlRouterProvider.otherwise('/');
    
    $stateProvider    
    .state('main',{
        url: '/',
        templateUrl: '/views/main.html'
    })

    .state('register',{
            url: '/register',
            templateUrl: '/views/register.html'
        })
    
    .state('signup',{
        url: '/signup',
        templateUrl: '/views/signup.html',
        controller: 'SignupCtrl'
    })
    .state('login',{
        url: '/login',
        templateUrl: '/views/login.html',
        controller: 'LoginCtrl'
    })
    .state('logout',{
        url: '/logout',
        controller: 'LogoutCtrl'
    });
    
    $httpProvider.interceptors.push('authInterceptor');
})
.constant('API_URL', 'http://127.0.0.1:3000/');
                               