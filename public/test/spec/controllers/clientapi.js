'use strict';

describe('Controller: ClientController', function () {

  // load the controller's module
  beforeEach(module('carsureApp'));

  var ClientapiCtrl,mockBackend,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, API_URL) {
      
    scope = $rootScope.$new();
    
      mockBackend = $httpBackend;
    mockBackend.expectGET(API_URL+'clients')
        .respond([{email: 'email@email.com'}]);
      
    ClientapiCtrl = $controller('ClientController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
      console.log('should attach a list of awesomeThings to the scope');
//    expect(scope.awesomeThings.length).toBe(3);
      expect(ClientapiCtrl.clients).toEqual([]);

    // Simulate a server response
    mockBackend.flush();

    expect(ClientapiCtrl.clients).toEqual([{email: 'email@email.com'}]);
  });
});
