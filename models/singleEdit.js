
var Edit = require('./edit'),
	User = require('./user'),
	Problem = require('./problem');

// inspired by https://github.com/sjuvekar/3Dthon/blob/master/route/index.js
module.exports.saveEdit = function(user2, prob2, section2, oldText2, newText2) {
	var newEdit = new Edit({
		user : user2,
		problem : prob2,
		section : section2,
		date : Date.now(),
		// placeholder for detecting changes to document
		oldText: oldText2,
		newText: newText2
	});
	newEdit.save(function(err) {
		if(!err) {
			Problem.findOne({nid : prob2}, function(error, theProblem) {
				if(!error) {
					updateSection(theProblem, section2, newText2);
				}
				else {
					console.log(error);
				}
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