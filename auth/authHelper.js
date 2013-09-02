/* authHelper.js
 * copied from https://github.com/sjuvekar/3Dthon/blob/master/auth/authHelper.js
 * September 1, 2013
*/


var User = require("../models/user");
 
// Helper function to create a new user 
// not used currently
module.exports.createUser = function(emailaddress, password1, password2, username, done) {
    if (password1 !== password2) 
	return done({message: "Passwords must match. Try signing up again!"});
    User.findOne({email: emailaddress}, function(err, result) {
	if (!err && result) {
	    console.log("User " + emailaddress + " already exists");  
	    return done({message: "Email id already exists. Try signing in using the id"});
	}
	else {
	    var new_user = new User({email: emailaddress,
				     password: password1,
				     name: username});
	    new_user.save(function(err) { 
		if(err) {
		    console.log("Error saving user " + emailaddress + "  " + err);
		    return done(err);
		}
		else {
		    console.log("Saved user " + emailaddress + " to database"); 
		    return done(null, new_user);
		}
	    });

	}
    });
};  

// Helper function to create Social user
module.exports.createSocialUser = function(profile, strategy, done) {
    var profile_id = profile.id;
    var profile_password = "*";
    var profile_name = profile.displayName;
    var imageurl = null;
    if (strategy == "google" && profile._json)
	imageurl = profile._json.picture;
    else if (profile.photos && profile.photos[0])
	imageurl = profile.photos[0].value;
    
    console.log(profile);
	console.log(profile_id);

    User.findOne({email: profile_id}, function(err, result) {
	if(!err && result) {
	    console.log("User already exists. Returning it from database");
	    return done(null, result);
	}
	else {
		console.log("herebefore");
	    var new_user = new User({email: profile_id,
				     password: profile_password,
				     name: profile_name,
				     imageurl: imageurl });
		console.log("here");
	    new_user.save(function(err) {
		if(err) {
		    console.log("Error saving user " + profile_id + " to database");
		    return done(err);
		}
		else {
		    console.log("Saved user " + profile_name + " to database");
		    return done(null, new_user);
		}
	    });
	}
    });
};