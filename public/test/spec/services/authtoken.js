'use strict';

describe('Service: authtoken', function () {

  // load the service's module
  beforeEach(module('carsureApp'));

  // instantiate service
  var authtoken;
  beforeEach(inject(function (_authtoken_) {
    authtoken = _authtoken_;
  }));

  it('should do something', function () {
    expect(!!authtoken).toBe(true);
  });

});
