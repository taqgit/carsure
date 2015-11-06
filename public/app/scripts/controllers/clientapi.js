'use strict';

/**
 * @ngdoc function
 * @name carsureApp.controller:ClientapiCtrl
 * @description
 * # ClientapiCtrl
 * Controller of the carsureApp
 */
var appClient = angular.module('carsureApp');

appClient.controller('ClientController', ['$http', 'API_URL',
  function ($http, API_URL) {
        var self = this;
        self.clients = [];
        console.log('Before hitting API  ....... ');
//        $http.get(API_URL + 'clients').then(
//            function (res) {
//                console.log('Response ....... ' + res.data[0].email);
//                self.clients = res.data;
//            },
//            function (err) {
//                console.log('Error fetching clients !');
//            }
//        );


        self.stockTemplate = 'views/partials/stock.html';
        self.stocks = [{
            name: 'KIA',
            price: '999'
        }, {
            name: 'HONDA',
            price: '333'
        }]
//        self.change = function (stock) {
//            self.stocks[0].price = '12345';
//        };


        self.currentTab = 'tab1';
      console.log('CurrentTab - '+self.currentTab);
       self.tabIt=function(tab){
            console.log('tabIT - '+tab);
            self.currentTab = tab;
       }
       self.clearTab = function(){
           self.currentTab = '';
       }
      console.log('CurrentTab Again - '+self.currentTab);
      
      self.changeFirstStock = function() {
          self.stocks[0].name = 'BMW Changed First stock in Ctrl';
      }
      
      self.changeAllStocks = function(){
          for(var i=0; i< self.stocks.length; i++)
              self.stocks[i]= {name: 'Changed All in Ctrl', price: 888};
      }
      
      self.selectedStock = function(stockName, stockPrice) {
          console.log('stockName when selected ' + stockName + ' stockPrice '+stockPrice);
      }


  }
]);

appClient.directive('stockWidget', [
    function(){
        return { 
            templateUrl: 'views/partials/stock.html',
            restrict: 'AEC',
            transclude: true,
            scope: {
                stockData: '=',
                stockTitle: '@',
                whenSelect: '&'
            },
            link: function($scope, $element, $attrs){
                        $scope.change = function(stock) {
                            console.log('What is stock price -> '+stock.price);
                            return ((59999-stock.price) * 100) / 59999;
                        }
                        
                        $scope.changeStockInDirective = function() {
                            $scope.stockData = {name: "Directive Stock ", price: 555};
                        }
                        
                        $scope.onSelect= function(){
                            $scope.whenSelect ( {
                                stockName: $scope.stockData.name,
                                stockPrice: $scope.stockData.price
                            })
                        }
            }
        };
    }
]);