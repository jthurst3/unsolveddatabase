var mongoose = require("mongoose");

// create a new section
var SectionSchema = mongoose.Schema({
    name: {
	type: String,
	required: true,
    },
    nid: {
	type: String,
	required: true,
    }
});


module.exports = mongoose.model('Section', SectionSchema);