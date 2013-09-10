var mongoose = require("mongoose");

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
    description: {
	type: String,
	required: true,
    },
    statement: {
	type: String,
	required: true
    },
    examples: {
	type: String,
	required: true
    },
    importance: {
	type: String,
	required: true
    },
    hardness: {
	type: String,
	required: true
    },
	history: {
	type: String,
	required: true
    },
	solutions: {
	type: String,
	required: true
    },
	implications: {
	type: String,
	required: true
    },
	faq: {
	type: String,
	required: true
    },
	forums: {
	type: String,
	required: true
    },
    references: {
	type: String,
	required: true
    },
    edits: {
	type: [mongoose.Schema.Types.ObjectId],
	required: true,
    }
});


module.exports = mongoose.model('Problem', ProblemSchema);