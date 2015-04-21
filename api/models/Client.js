var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var ClientSchema = new mongoose.Schema({
    email: String,
    name: String,
    mobile: String,
    dob: String,
    street: String,
    cityProvZip: String,
    country: String,
    password: String,
    active: Boolean,
    googleId: String,
    facebookId: String,
    displayName: String,
    emailVerified: Boolean,
    licenseType: String,
    licenseDate: String,
    applied: Boolean

})


ClientSchema.methods.toJSON = function () {
    var client = this.toObject();
    delete client.password;

    return client;
}
ClientSchema.methods.comparePasswords = function (password, callback) {
    bcrypt.compare(password, this.password, callback);
}

ClientSchema.pre('save', function (next) {
    var client = this;
    if (!client.isModified('password'))
        return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(client.password, salt, null, function (err, hash) {
            if (err) return next(err);

            client.password = hash;
            next();
        })
    })

})

module.exports = mongoose.model('Client', ClientSchema);