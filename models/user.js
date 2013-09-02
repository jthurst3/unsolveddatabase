/* user.js
 * modified from https://github.com/sjuvekar/3Dthon/blob/master/models/user.js
 * September 1, 2013
*/


var mongoose = require("mongoose")
    , bcrypt = require("bcrypt")
    , SALT_WORK_FACTOR = 10;

// create a new User
var UserSchema = mongoose.Schema({
    email: {
	type: String,
	required: true,
    },
    password: {
	type: String,
	required: true
    },
    name: {
	type: String,
	required: true
    },
    imageurl: {
	type: String
    }
});

UserSchema.pre('save', function(next) { 
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
 
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
	if (err) return next(err);
 
	// hash the password along with our new salt
	bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
 
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
	});
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);