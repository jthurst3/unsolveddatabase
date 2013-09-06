/* google.js
 * modified from https://github.com/sjuvekar/3Dthon/blob/master/auth/google.js
 * September 1, 2013
*/


var passport = require("passport")
  , authHelper = require("./authHelper")
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


// Google Tokens
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


// Google login strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
  },
  function(accessToken, refreshToken, profile, done) {
      return authHelper.createSocialUser(profile, "google", done);
  }
));


module.exports.googleAuth = function() { return passport.authenticate("google"); };
module.exports.googleAuthWithCallback = function() { 
    return passport.authenticate("google", { 
	successReturnToOrRedirect: "/dashboard", 
	failureRedirect: "/signup" 
    });
};