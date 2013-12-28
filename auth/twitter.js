/* twitter.js
 * modified from https://github.com/sjuvekar/3Dthon/blob/master/auth/twitter.js
 * September 1, 2013
*/


var passport = require("passport")
  , authHelper = require("./authHelper")
  , TwitterStrategy = require('passport-twitter').Strategy;


// Twitter tokens
var TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;

// Twitter login Strategy
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
      return authHelper.createSocialUser(profile, "twitter", done);
  }
));

module.exports.twitterAuth = function(request, response, next) { 
  // modified from http://passportjs.org/guide/authenticate/
  return passport.authenticate("twitter", function(err, user, info) {
    if(err) return next(err);
    if(!user) return "/";
    request.login(user, function(error) {
      if(error) return next(error);
      return response.redirect(request.session.returnURL);
    });
  })(request, response, next); 
};

module.exports.twitterAuthWithCallback = function(request, response, next) { 
  // modified from http://passportjs.org/guide/authenticate/
  return passport.authenticate("twitter", function(err, user, info) {
    if(err) return next(err);
    if(!user) return "/";
    request.login(user, function(error) {
      if(error) return next(error);
      return response.redirect(request.session.returnURL);
    });
  })(request, response, next);
};