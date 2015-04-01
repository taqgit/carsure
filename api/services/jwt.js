var jwt = require('jwt-simple');
var moment = require('moment');

module.exports = function (client, res){
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
