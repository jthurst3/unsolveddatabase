/* mongooseDB.js
 * modified from https://github.com/sjuvekar/3Dthon/blob/master/models/mongooseDB.js
 * September 1, 2013
*/

var mongoose = require('mongoose');
var mongodb = require('mongodb');

var uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  "mongodb://jthurst3:" + process.env.MONGODB_PASSWORD + "@ds043338.mongolab.com:43338/heroku_app17128323";

module.exports.mongooseInit = function() {
    mongoose.connect(uristring, function (err, res) {
	if (err) { 
	    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
	} else {
	    console.log ('Succeeded connection too: ' + uristring);
	    console.log("hello");
	    var admin = new mongodb.Admin(mongoose.connection.db);
	    console.log("hello there2");
		  admin.buildInfo(function (err, info) {
		     console.log(info.version);
		  });
		  console.log("hellothere");
	}
    });
};