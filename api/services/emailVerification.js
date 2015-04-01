var _ = require('underscore');
var fs = require('fs');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./config.js');
var Client = require('../models/Client.js');

var model = {
    verifyUrl: 'http://localhost:3000/auth/verifyEmail?token=',
    title: 'carsure',
    subTitle: 'Thanks for signing up',
    body: 'Please verify your email address by clicking the button below'
}

exports.send = function (email) {
    var payload = {
        sub: email
    }
    
    var token = jwt.encode(payload, config.EMAIL_SECRET);
    console.log('token before sending ->   '+token);
    
    var transporter = nodemailer.createTransport(smtpTransport({
		host: 'smtp.mailgun.org',
		secure: true,
		auth: {
			user: 'postmaster@carsure.biz',
			pass: config.SMTP_PASS
		}
	}));

	var mailOptions = {
		from: 'CarSure Biz <postmaster@carsure.biz>',
		to: email,
		subject: 'Carsure Signup Verification',
		html: getHtml(token)
	};

    transporter.sendMail(mailOptions, function(err, info){
//        if(err) return res.status(500, err);
        if(err) throw err;
        
        console.log('email sent ', info.response);
    });
}

exports.handler = function(req, res) {
    var token = req.query.token
    console.log('token from verify link ->   '+token);
    
    var payload = jwt.decode(token, config.EMAIL_SECRET);
    
    var email = payload.sub;
    
    if(!email) handleError(res);
    
    Client.findOne({email: email}, function(err, foundClient){
        if(err) return res.status(5000);
        
        if(!foundClient) return handleError(res);
        
        if(!foundClient.active)
            foundClient.active = true;
        foundClient.save(function(err){
            if(err) return res.status(500);
            
            return res.redirect(config.APP_URL);
        })
    })
    
    
}

function handleError(res) {
    return res.status(401).send({message: 'Authentication failed, unable to verify email'});    
}

function getHtml(token){
    var path = './views/emailVerification.html';
    var html = fs.readFileSync(path, encoding = 'utf8');
    
    /* Change it to read file asynch in PROD
    fs.readFile('/etc/passwd', function (err, data) {
      if (err) throw err;
      console.log(data);
    });
    */
    var template = _.template(html);
    
    model.verifyUrl += token;
    
    return template(model);
}

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};