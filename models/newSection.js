var Problem = require('./problem');

module.exports.newSection = function(prob2, section2, sectionName2, sectionNumber2) {
	// error check
	Problem.find({nid: prob2, "content.sectionId": section2}, function(error, result) {
		if(result == null) {
			// update problem
			Problem.update({nid: prob2}, {
				$push: {
					sectionId: section2,
					sectionName: sectionName2,
					sectionNumber: sectionNumber2,
					sectionText: ""
				}
			}, function(error, result) {});
		} else {
			console.log(prob2 + " already has a section named " + section2);
		}
	})
}