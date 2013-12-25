var mongoose = require("mongoose");

// create a new field
var FieldSchema = mongoose.Schema({
    name: {
	type: String,
	required: true,
    },
    nid: {
	type: String,
	required: true,
    }
});


module.exports = mongoose.model('Field', FieldSchema);