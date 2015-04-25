'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var compression = require('compression');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var Client = require('../api/models/Client');
var emailVerification = require('../api/services/emailVerification.js');
var request = require('request');
var facebookauth = require('../api/services/facebookAuth.js');
var createSendToken = require('../api/services/jwt.js');
var config = require('../api/services/config.js');
var twilio = require('twilio');
var client = new twilio.RestClient('AC0060490b2d3e4234ab2966513a4d88d5 ', 'd2864356c5dc890f922799ee5a78491c ');

var app = express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(compression());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());

app.use(favicon(path.join(__dirname, '../public') + '/favicon.ico'));
app.use(express.static(path.join(__dirname, '../public')));
app.set('appPath', path.join(__dirname, '../public'));
app.use(morgan('dev'));

// All undefined asset or api routes should return a 404
var errors = require('./components/errors');
app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

// All other routes should redirect to the index.html
app.route('/*')
    .get(function (req, res) {
        res.sendFile(path.join(__dirname, '../public') + '/index.html');
    });

app.post('/sendSms', function (req, res) {
    console.log('Sending SMS to ------------------->  ' + req.body.mobile);
    //Send an SMS text message
    client.sendMessage({

        to: '+1' + req.body.mobile, // Any number Twilio can deliver to
        from: '+12898071433', // A number you bought from Twilio and can use for outbound communication
        body: 'Enter this code to verify:  ' + req.body.code // body of the SMS message

    }, function (err, responseData) { //this function is executed when a response is received from Twilio

        if (!err) { // "err" is an error received during the request, if any

            // "responseData" is a JavaScript object containing data received from Twilio.
            // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
            // http://www.twilio.com/docs/api/rest/sending-sms#example-1

            console.log(responseData.from); // outputs "+14506667788"
            console.log(responseData.body); // outputs "word to text."

        }
    });
});

app.post('/updateClient', function (req, res) {
    var searchClientEmail = req.body.client.email;

    console.log('   searchClientEmail ' + req.body.client);
    //    var query = Client.where(searchClientEmail);
    Client.findOne({
        'email': searchClientEmail
    }, function (err, client) {
        if (err) throw err

        if (!client) return res.status(401).send({
            message: 'Client Not Found'
        });

        console.log(' Client from DB -> ' + JSON.stringify(client));
        client.applied = true;
        client.name = req.body.client.name;
        client.mobile = req.body.client.mobile;
        client.dob = req.body.client.dob;
        client.street = req.body.client.street;
        client.cityProvZip = req.body.client.cityProvZip;
        client.country = req.body.client.country;
        client.licenseType = req.body.client.licenseType;
        client.licenseDate = req.body.client.licenseDate;

        client.save(function (err) {
            if (err)
                console.log('Could Not Save ===================================');
        });
        //return res.json(client);
    })
});

app.post('/signup', function (req, res) {
    var client = req.body;
    var searchClient = {
        email: client.email
    };
    var newClient = new Client({
        email: client.email,
        password: client.password
    });
    Client.findOne(searchClient, function (err, client) {
        if (err) throw err

        if (client) return res.status(401).send({
            message: 'Email already exists'
        });
        emailVerification.send(searchClient.email);
        newClient.save(function (err) {
            createSendToken(newClient, res);
        });
    });
});

app.post('/auth/facebook', facebookauth);
app.post('/auth/google', function (req, res) {
    //    console.log('code '+req.body.code);    
    var url = 'https://accounts.google.com/o/oauth2/token';
    var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
            client_id: req.body.clientId,
            redirect_uri: req.body.redirectUri,
            code: req.body.code,
            grant_type: 'authorization_code',
            client_secret: config.GOOGLE_SECRET
        }
        //    console.log('params '+params.client_id + ' ' + params.redirect_uri  );
    request.post(url, {
        json: true,
        form: params,
    }, function (err, response, token) {
        //            console.log(token);
        var accessToken = token.access_token;
        var headers = {
            Authorization: 'Bearer ' + accessToken
        }

        request.get({
            url: apiUrl,
            headers: headers,
            json: true
        }, function (err, response, profile) {
            //            console.log(' Google Response ' + JSON.stringify(response));
            //            console.log(' Google Profile  ' + JSON.stringify(profile));
            Client.findOne({
                googleId: profile.sub
            }, function (err, foundClient) {
                if (foundClient) {
                    return createSendToken(foundClient, res);
                }
                var newClient = new Client();
                newClient.email = response.body.email;
                newClient.emailVerified = response.body.email_verified;
                newClient.googleId = profile.sub;
                newClient.displayName = profile.name;
                newClient.save(function (err) {
                    console.log('saving .........');
                    if (err) return next(err);
                    return createSendToken(newClient, res);
                })
            })
        })
    });
});

app.get('/auth/verifyEmail', emailVerification.handler);
app.post('/findClientById', function (req, res) {

    var searchClientId = req.body.clientId + '';

    console.log('   searchClientId ' + searchClientId);
    var query = Client.where(searchClientId);
    Client.findById(searchClientId, function (err, client) {
        if (err) throw err

        if (!client) return res.status(401).send({
            message: 'Client Not Found'
        });

        console.log(' Client from DB -> ' + JSON.stringify(client));

        return res.json(client);
    })
});

app.post('/login', function (req, res) {
    req.client = req.body;
    console.log(' login with these ->           ' + req.client.email + ' pasowrd   ' + req.client.password);
    var searchClient = {
        email: req.client.email
    };
    Client.findOne(searchClient, function (err, client) {
        console.log('Found client for login   ->  ' + client);
        if (err) throw err

        if (!client) return res.status(401).send({
            message: 'Wrong email/password'
        });

        client.comparePasswords(req.client.password, function (err, isMatch) {
            console.log('Passoword matched ?   ->  ' + isMatch);
            if (err) throw err

            if (!isMatch)
                return res.status(401).send({
                    message: 'Wrong email/password'
                });

            createSendToken(client, res);
        });
    })
});


app.get('/clients', function (req, res) {
    //    var token = req.headers.authorization.split(' ')[1];
    //    var payload = jwt.decode(token, "shhh...");
    //    if(!payload.sub) 
    //        res.status(401).send({
    //            message: 'Authentication failed'
    //        });
    //    if(!req.headers.authorization) {
    //        return res.status(401).send({
    //            message: 'You are not authorized'
    //        });
    //    }
    console.log('Before Hitting DB');
    Client.find(function (err, clients) {
        console.log('Inside find DB' + err);
        if (err) throw err

        if (clients) {
            return res.json(clients);
        }
    });
});







var server = require('http').createServer(app);

var port = process.env.PORT || 3000;
var ip = process.env.IP || 'localhost';

mongoose.connect('mongodb://admin:admin@ds045057.mongolab.com:45057/carsuredev');



// Start server
server.listen(port, ip, function () {
    console.log('Express server listening on %d, in %s mode', port, 'dev or prod');
});
