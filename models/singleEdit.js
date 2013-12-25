
var Edit = require('./edit'),
	User = require('./user'),
	Problem = require('./problem');

// inspired by https://github.com/sjuvekar/3Dthon/blob/master/route/index.js
module.exports.saveEdit = function(user2, prob2, section2, oldText2, newText2) {
	var date2 = Date.now();
	var newEdit = new Edit({
		user : user2,
		problem : prob2,
		section : section2,
		date : date2,
		// placeholder for detecting changes to document
		oldText: oldText2,
		newText: newText2
	});
	newEdit.save(function(err, res) {
		if(!err) {
			console.log(user2 + '\n' + prob2 + '\n' + section2 + '\n' + oldText2 + '\n' + newText2);
			console.log("here");
			User.findOne({_id: user2}, function(error, result) {
				console.log("this is the user:");
				console.log(result);
			});
			// update the problem
			Problem.update({nid: prob2, "content.sectionId":section2},
				{
					$set: {"content.$.sectionText": newText2},
				}, function(error, result) {});
			// update the user
			User.update({_id: user2}, {
				$push: {"edits": {
					problem: prob2,
					section: section2,
					date: date2,
					changes: newText2
				}}
			}, function(error, result) {
				console.log("this is the error: " + error);
				console.log("this is the result: " + result);
			});
		}
		else {
			console.log(err);
		}
	});
}

var updateSection = function(theProblem, section, newText) {
	switch(section) {
	case "description":
		theProblem.update({description : newText}, function(err, numberAffected, raw) {
			console.log(numberAffected);
		});
		break;
	case "statement":
		theProblem.update({statement : newText}, function(err, numberAffected, raw) {
			console.log(numberAffected);
		});
		break;
	case "examples":
		theProblem.update({examples : newText}, function(err, numberAffected, raw) {
			console.log(numberAffected);
		});
		break;
	case "importance":
		theProblem.update({importance : newText}, function(err, numberAffected, raw) {
			console.log(numberAffected);
		});
		break;
	case "hardness":
		theProblem.update({hardness : newText}, function(err, numberAffected, raw) {
			console.log(numberAffected);
		});
		break;
	case "history":
		theProblem.update({history : newText}, function(err, numberAffected, raw) {
			console.log(numberAffected);
		});
		break;
	case "solutions":
		theProblem.update({solutions : newText}, function(err, numberAffected, raw) {
			console.log(numberAffected);
		});
		break;
	case "implications":
		theProblem.update({implications : newText}, function(err, numberAffected, raw) {
			console.log(numberAffected);
		});
		break;
	case "faq":
		theProblem.update({faq : newText}, function(err, numberAffected, raw) {
			console.log(numberAffected);
		});
		break;
	case "forums":
		theProblem.update({forums : newText}, function(err, numberAffected, raw) {
			console.log(numberAffected);
		});
		break;
	case "references":
		theProblem.update({references : newText}, function(err, numberAffected, raw) {
			console.log(numberAffected);
		});
		break;
	default: break;
	}
}