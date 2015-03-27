var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var Client = require('./models/Client.js');
var jwt = require('jwt-simple');
var emailVerification = require('./services/emailVerification.js');
var moment = require('moment');

app.use(bodyParser.json());

app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    next();
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
            createToken(newClient, res);
        });
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
            
            createToken(client, res);
        });
    })
});

function createToken(client, res){
    var payload = {
		sub: client.id,
		exp: moment().add(10, 'days').unix()
	}

	var token = jwt.encode(payload, "shhh..");

	res.status(200).send({
		client: client.toJSON(),
		token: token
	});
}

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