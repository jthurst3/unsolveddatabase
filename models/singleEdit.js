
var Edit = require('./edit'),
	User = require('./user'),
	Problem = require('./problem');

// inspired by https://github.com/sjuvekar/3Dthon/blob/master/route/index.js
module.exports.saveEdit = function(user2, prob2, section2, oldText2, newText2) {
	var date2 = Date.now();
	Problem.findOne({nid: prob2, "content.sectionId": section2}, function(err,result) {
		console.log("result.name: " + result.name);
		var probName2 = result.name;
		var newEdit = new Edit({
		user : user2,
		problem : prob2,
		problemName : probName2,
		section : section2,
		date : date2,
		// placeholder for detecting changes to document
		oldText: oldText2,
		newText: newText2
	});
	newEdit.save(function(err, res) {
		if(!err) {
			// update the problem
			Problem.update({nid: prob2, "content.sectionId":section2}, {
					$set: {"content.$.sectionText": newText2},
			}, function(error, result) {});
			// update the user
			User.update({_id: user2}, {
				$push: {"edits": res}
			}, function(error, result) {
				console.log("this is the error: " + error);
				console.log("this is the result: " + result);
			});
		}
		else {
			console.log(err);
		}
	});
	});
	
}









