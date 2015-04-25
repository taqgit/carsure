var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');


console.log('rootPath --------------------    ' + rootPath);

//module.exports = {
//    development: {
//        db: 'mongodb://localhost/carsure',
//        rootPath: rootPath,
//        port: process.env.PORT || 3030
//    },
//    production: {
//        rootPath: rootPath,
//        db: 'mongodb://admin:admin@ds045057.mongolab.com:45057/carsuredev',
//        port: process.env.PORT || 80
//    }
//}
module.exports = {
    EMAIL_SECRET: 'somesecret',
    SMTP_PASS: '0ca0b85f08e4510f90ffed24bb4c6251',
    APP_URL: 'http://localhost:9000/',
    FACEBOOK_SECRET: '8cdf109e45e5aa32f61c8b707207296d',
    GOOGLE_SECRET: 'VOfh6_KbjBWX12Q3hFggAgeE',
    rootPath: rootPath
};