var Field = require('./field');

module.exports.newField = function(name2, nid2) {
	// var date2 = Date.now();
	Field.findOne({nid: nid2}, function(error, result) {
		if(result == null || result == []) {
			var newField = new Field({
				nid: nid2,
				name: name2
			});
			newField.save(function(err,res) {
				if(!err) {
					console.log(res);
				} else {
					console.log(err);
				}
			});
		} else {
			console.log("Field already exists.");
		}
	})
}