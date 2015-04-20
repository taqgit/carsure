'use strict';

angular.module('carsureApp').service('clientmanagement', function clientmanagement($http, API_URL) {
    var self = this;
    this.findClientById = function (clientId) {
        return $http.post(API_URL + 'findClientById', {
            clientId: clientId
        }).then(
            function (res) {
                console.log('Response ....... ' + res.data.email);
                return res;
            },
            function (err) {
                console.log('Error fetching clients !');
            }
        );
    }

    this.updateClient = function (client) {
        return $http.post(API_URL + 'updateClient', {
            client: client
        }).then(function (res) {
            console.log('Updatde client in clientmanagement  ++++++++++++++++++++++++++++');
        }, function (err) {
            console.log('Colud not update client in clientmanagement  !!!!!!!!!!!!!!');
        })
    }


});