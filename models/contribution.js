var mongoose = require("mongoose");

// create a new contribution
// not ready for production
var ContributionSchema = mongoose.Schema({
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
    comment: {
	type: String,
	required: true,
    },
});


module.exports = mongoose.model('Contribution', ContributionSchema);