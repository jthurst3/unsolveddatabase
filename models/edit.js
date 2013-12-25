var mongoose = require("mongoose");

// create a new problem
var EditSchema = mongoose.Schema({
	user: {
		type: String,
		required: true
	},
    problem: {
	type: String,
	required: true,
    },
    section: {
	type: String,
	required: true,
    },
    date: {
	type: Date,
	required: true,
    },
	oldText: {
		type: String
	},
	newText: {
		type: String
	}
});


module.exports = mongoose.model('Edit', EditSchema);