var mongoose = require("mongoose");

// create a new problem
var EditSchema = mongoose.Schema({
	user: {
		type: String,
		required: true
	}
    problem: {
	type: String,
	required: true,
    },
    topic: {
	type: String,
	required: true,
    },
    date: {
	type: Date,
	required: true,
    },
    changes: {
	type: [mongoose.Schema.Types.ObjectId],
	required: true,
    },
});


module.exports = mongoose.model('Edit', EditSchema);