var mongoose = require("mongoose");

// create a new field
var FAQSchema = mongoose.Schema({
    number: {
	type: Number,
	required: true,
    },
    question: {
	type: String,
	required: true,
    },
    answer: {
    	type: String,
    	required: true
    }
});


module.exports = mongoose.model('FAQ', FAQSchema);