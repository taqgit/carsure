var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var Client = require('./models/Client.js');
var emailVerification = require('./services/emailVerification.js');
var request = require('request');
var facebookauth = require('./services/facebookAuth.js');
var createSendToken = require('./services/jwt.js');
var config = require('./services/config.js');

app.use(bodyParser.json());

app.use(function(req,res,next){
//    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    next();
});

app.post('/apply', function(req, res) {
    console.log('Application in progress for ' + req.body.mobile);
});

app.post('/signup', function(req, res){
    var client = req.body;
    var searchClient = {email: client.email};
    var newClient = new Client({
        email: client.email,
        password: client.password
    });
    Client.findOne(searchClient, function(err, client){
        if(err) throw err
        
        if(client) return res.status(401).send({message: 'Email already exists'});
        emailVerification.send(searchClient.email);
        newClient.save(function(err){
            createSendToken(newClient, res);
        });
    });
    
    
});

app.post('/auth/facebook', facebookauth);
app.post('/auth/google', function(req, res){
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
        }, function(err, response, token) {    
//            console.log(token);
            var accessToken = token.access_token;
            var headers = {
                Authorization: 'Bearer '+accessToken
            }
        
            request.get({
                url: apiUrl,
                headers: headers,
                json: true
            }, function(err, response, profile){
                Client.findOne({
                    gooleId: profile.sub
                }, function (err, foundClient) {
                        if(foundClient) return createSendToken(foundClient, res);
                        var newClient = new Client();
                        newClient.googleId = profile.sub;
                        newClient.displayName = profile.name;
                        newClient.save(function (err) {
                            console.log('saving .........');
                            if(err) return next(err);
                            createSendToken(newClient, res);
                        })
                    })
            })
    }); 
                 
                 
});

app.get('/auth/verifyEmail', emailVerification.handler);

app.post('/login', function(req, res) {
    req.client = req.body;
    var searchClient = {email: req.client.email};
    Client.findOne(searchClient, function(err, client){
        if(err) throw err
        
        if(!client) return res.status(401).send({message: 'Wrong email/password'});
        
        client.comparePasswords(req.client.password, function(err, isMatch){
            if(err) throw err
            
            if(!isMatch) 
                return res.status(401).send({message: 'Wrong email/password'});
            
            createSendToken(client, res);
        });
    })
});

//var cars = ['Kia','Bugati','yourcar'];
//app.get('/cars', function(req, res) {
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
//    
//    res.json(cars);
//}

mongoose.connect('mongodb://admin:admin@ds045057.mongolab.com:45057/carsuredev');

var server = app.listen(3000, function(){
    console.log('api listening on ', server.address().port);
});