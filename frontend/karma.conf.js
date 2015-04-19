// Karma configuration

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'app/scripts/controllers/cientapi.js'
    ],
    exclude: [],
    port: 9000,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome','Firefox','Safari'],
    singleRun: false
  });
};
