var Problem = require('./problem');

module.exports.newProblem = function(prob2, probName2, topic2, topicid2, subtopic2) {
	// var date2 = Date.now();
	Problem.findOne({nid: prob2}, function(error, result) {
		if(result == null || result == []) {
			var newProblem = new Problem({
				nid: prob2,
				name: probName2,
				topic: topic2,
				topicid: topicid2,
				subtopic: subtopic2,
				edits: [],
				content: [{
		            "sectionId": "description",
		            "sectionName": "Description",
		            "sectionNumber": 1,
		            "sectionText": ""
				}]
			});
			newProblem.save(function(err,res) {
				if(!err) {
					console.log(res);
				} else {
					console.log(err);
				}
			});
		} else {
			console.log("Problem already exists.");
		}
	})
}