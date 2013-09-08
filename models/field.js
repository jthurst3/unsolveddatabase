var mongoose = require("mongoose");

// create a new problem
var FieldSchema = mongoose.Schema({
    name: {
	type: String,
	required: true,
    },
    id: {
	type: String,
	required: true,
    }
});


module.exports = mongoose.model('Field', FieldSchema);