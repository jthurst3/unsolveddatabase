var mongoose = require("mongoose");

// create a new field
var CarouselItemSchema = mongoose.Schema({
    number: {
	type: Number,
	required: true,
    },
    pic: {
	type: String,
	required: true,
    },
    url: {
    	type: String,
    	required: true
    },
    color: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    subtext: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('CarouselItem', CarouselItemSchema);