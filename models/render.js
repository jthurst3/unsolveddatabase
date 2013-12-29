var mongoose = require("mongoose"),
	Field = require("./field");

// inspired by https://github.com/sjuvekar/3Dthon/blob/master/route/index.js
module.exports.render = function(destination, options, request, response) {
	Field.find({}, function(err, fieldList) {
		options.fields = fieldList;
		response.render(destination, options);
	});
}