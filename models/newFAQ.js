var FAQ = require('./faq');

module.exports.newFAQ = function(num2, question2, answer2) {
	FAQ.findOne({number: num2}, function(error, result) {
		if(result == null || result == []) {
			var newFAQ = new FAQ({
				number: num2,
				question: question2,
				answer: answer2
			});
			newFAQ.save(function(err,res) {
				if(err) console.log(err);
			});
		} else {
			console.log("Question number already exists.");
		}
	})
}