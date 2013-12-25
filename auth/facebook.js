/* facebook.js
 * modified from https://github.com/sjuvekar/3Dthon/blob/master/auth/facebook.js
 * September 1, 2013
*/


var passport = require("passport")
  , authHelper = require("./authHelper")
  , FacebookStrategy = require('passport-facebook').Strategy;

// Facebook tokens
var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// Facebook login strategy
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    profileFields: ['id', 'displayName', 'photos'],
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      return authHelper.createSocialUser(profile, "facebook", done);
  }
));


module.exports.facebookAuth = function() { return passport.authenticate("facebook"); };
module.exports.facebookAuthWithCallback = function(redirect) { 
    return passport.authenticate("facebook", { 
	successReturnToOrRedirect: redirect, 
	failureRedirect: '/' 
    });
};  