
var Edit = require('./edit'),
	User = require('./user'),
	Problem = require('./problem');

// inspired by https://github.com/sjuvekar/3Dthon/blob/master/route/index.js
module.exports.saveEdit = function(prob, request, response) {
	var userId = request.user._id;
	var newEdit = new Edit({
		user : userId,
		problem : prob.nid,
		topic : prob.topic,
		date : Date.now(),
		// placeholder for detecting changes to document
		changes : {
			"old" : "",
			"new" : ""
		}
	});
	newEdit.save(function(err) {
		if(!err) {
			User.findOne({_id : userId}, function(err, theUser) {
				theUser.edits.push(newEdit._id);
			});
			prob.edits.push(newEdit._id);
		}
	});
}