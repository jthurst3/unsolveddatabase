var mongoose = require("mongoose"),
	Edit = require('./edit');

// create a new problem
var ProblemSchema = mongoose.Schema({
    nid: {
	type: String,
	required: true,
    },
    name: {
	type: String,
	required: true,
    },
    topic: {
	type: String,
	required: true,
    },
    subtopic: {
	type: String,
	required: true,
    },
    content: {
    	type: Array,
    	required: true
    },
    edits: {
	type: [Edit],
	required: true,
    }
});


module.exports = mongoose.model('Problem', ProblemSchema);