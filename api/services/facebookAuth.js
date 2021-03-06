var request = require('request');
var qs = require('querystring');
var createSendToken = require('./jwt.js');
var config = require('./config.js');
var Client = require('../models/Client.js');

module.exports = function (req, res) {
    var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/me';

    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: config.FACEBOOK_SECRET,
        code: req.body.code
    };

    request.get({
        url: accessTokenUrl,
        qs: params
    }, function (err, response, accessToken) {
        accessToken = qs.parse(accessToken);

        request.get({
            url: graphApiUrl,
            qs: accessToken,
            json: true
        }, function (err, response, profile) {
            console.log('Facebook Response:             ' + JSON.stringify(response));
            console.log('Facebook profile:              ' + JSON.stringify(profile));

            Client.findOne({
                facebookId: profile.id
            }, function (err, existingClient) {
                if (existingClient)
                    return createSendToken(existingClient, res);

                var newClient = new Client();
                newClient.email = response.body.email;
                newClient.emailVerified = response.body.verified;
                newClient.facebookId = profile.id;
                newClient.displayName = profile.name;
                newClient.save(function (err) {
                    createSendToken(newClient, res);
                })
            })

        })
    })
}