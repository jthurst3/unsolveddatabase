/* user.js
 * modified from https://github.com/sjuvekar/3Dthon/blob/master/models/user.js
 * September 1, 2013
*/


var mongoose = require("mongoose");

// create a new User
var UserSchema = mongoose.Schema({
    email: {
	type: String,
	required: true,
    },
    name: {
	type: String,
	required: true
    },
    imageurl: {
	type: String
    },
	edits: {
		type: [mongoose.Schema.Types.ObjectId]
	},
	contributions: {
		type: [mongoose.Schema.Types.ObjectId]
	}
});

module.exports = mongoose.model('User', UserSchema);