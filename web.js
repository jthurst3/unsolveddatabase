// Define routes for simple SSJS web app. 
// Writes Coinbase orders to database.
// Login strategies and mongoose initialization inspired by Sudeep Juvekar's repository: https://github.com/sjuvekar/3Dthon
// Persistent sessions inspired by http://stackoverflow.com/questions/7990890/how-to-implement-login-auth-in-node-js

// use correct environment
var env = require('node-env-file');
env(__dirname + '/.env');

// IMPORT STATEMENTS
var async   = require('async')
  , express = require('express')
  , fs      = require('fs')
  , http    = require('http')
  , https   = require('https')
  // , db      = require('./models')
  , passport = require('passport')
  , facebookAuth = require("./auth/facebook")
  , twitterAuth = require("./auth/twitter")
  , googleAuth = require("./auth/google")
  , flash = require('connect-flash')
  , mongooseDB = require('./models/mongooseDB')
  , User = require('./models/user')
  , Problem = require('./models/problem')
  , Edit = require('./models/edit')
  , Field = require('./models/field')
  , Section = require('./models/section')
  , FAQ = require('./models/faq')
  , CarouselItem = require('./models/carouselitem')
  , SingleEdit = require('./models/singleEdit')
  , NewProblem = require('./models/newProblem')
  , NewSection = require('./models/newSection')
  , NewFAQ = require('./models/newFAQ')
  , NewCarouselItem = require('./models/newCarouselItem')
  , NewField = require('./models/newField')
  , MongoStore = require('connect-mongo')(express);

  
// SET UP THE APP
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set("view options", {layout: false}); // from http://stackoverflow.com/questions/13765315/opening-html-file-using-express-js
app.set('port', process.env.PORT || 8080);
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({
  store: new MongoStore({
    url: "mongodb://jthurst3:" + process.env.MONGODB_PASSWORD + "@ds043338.mongolab.com:43338/heroku_app17128323"
  }),
  secret:'secretkey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use("/assets", express.static(__dirname + "/assets")); // technique from https://github.com/sjuvekar/3Dthon/blob/master/web.js
app.use("/models", express.static(__dirname + "/models"));

// Initialize mongoose DB
mongooseDB.mongooseInit();

// Passport js sessions
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
	    done(err, user);
	  });
});

// Facebook login and callbacks
app.get('/auth/facebook', function(request, response, next) {
  request.session.returnURL = request.headers.referer;
  return facebookAuth.facebookAuth(request, response, next);});
app.get('/auth/facebook/callback', function(request, response, next) {
  return facebookAuth.facebookAuthWithCallback(request, response, next)});

// Twitter login and callbacks
app.get('/auth/twitter', function(request, response, next) {
  request.session.returnURL = request.headers.referer;
  return twitterAuth.twitterAuth(request, response, next);
})
app.get('/auth/twitter/callback', function(request, response, next) {
  return twitterAuth.twitterAuthWithCallback(request, response, next)});

// Google login and callbacks
app.get('/auth/google', function(request, response, next) {
  request.session.returnURL = request.headers.referer;
  return googleAuth.googleAuth(request, response, next);});
app.get('/auth/google/callback', function(request, response, next) {
  return googleAuth.googleAuthWithCallback(request, response, next)});
	

var render2 = function(destination, options, request, response) {
  options.alert = request.session.alert;
  options.alertType = request.session.alertType;
  options.alertText = request.session.alertText;
  options.user = request.user;
  async.series([
    function(callback) {
      Field.find({}, function(err, fieldList) {
        options.fields = fieldList;
        response.render(destination, options);
      });
      callback();
    }
    ], function(err) {
      if(err) return next(err);
      // reset some session variables
      request.session.alert = false;
      request.session.alertType = null;
      request.session.alertText = null;
    })
}


// Render homepage (note trailing slash): example.com/
app.get('/', function(request, response) {
  CarouselItem.find({}, function(err, items) {
    if(err) {
      console.log(err);
      response.redirect('/servererror');
    } else {
      render2("index", {
        navid: 1,
        carouselItems: items
    }, request, response);
    }
  });
});

app.get('/about', function(request, response) {
    render2("about", {navid:2}, request, response);
});

app.get('/contact', function(request, response) {
    render2("contact", {navid:3}, request, response);
});

app.get('/problem/:probName', function(request, response) {
	var problem = Problem.findOne({nid:request.params.probName}, function(err, result) {
    if(!err) {
      if(result == null) {
        render2("notFound", {}, request, response);
      } else {
        // find an easy way to sort a MongoDB subarray so we don't have to keep "find"ing the same problem
        render2("problem/problem", {problem: result}, request, response);
      }
    }
		else {
      console.log(err);
    }
	});
});

app.get('/categories/:field', function(request, response) {
	var category = Field.findOne({nid:request.params.field}, function(err, result) {
    if(!err) {
      if(result == null) {
        render2("notFound", {}, request, response);
      } else {
      var problems = Problem.find({topic: result.name}, function(error, result2) {
        render2("categories/field", {field: result, problems: result2}, request, response);
      });
      }
    } else {
      console.log(err);
    }
	});
});

app.get('/newProblem', function(request, response) {
  var q = request.query;
  var ses = request.session;
  if(!request.user) {
    console.log("User not logged in.");
    ses.alert = true;
    ses.alertType = "alert-error";
    ses.alertText = "You must be logged in to create an unsolved problem page.";
    response.redirect(request.headers.referer || "/");
  } else {
    // check to see if problem already exists
    Problem.findOne({nid: q.problemAbbrev}, function(err, problems) {
      if(err) {
        console.log(err);
        response.redirect("/servererror");
      } else if(problems == null || problems == []) {
        // problem does not exist, create new problem
        // modified from http://www.sebastianseilund.com/nodejs-async-in-practice
        async.series([
          function(callback) {
            NewProblem.newProblem(q.problemAbbrev, q.problemName, q.topic, q.topicid, q.subtopic);
            callback();
          }
          ], function(err) {
            if(err) return next(err);
            response.redirect('/problem/' + q.problemAbbrev);
          });
      } else {
        // problem exists, don't submit
        ses.alert = true;
        ses.alertType = "alert-error";
        ses.alertText = "Problem \"" + q.topicid + "\" already exists.";
        response.redirect("/categories/" + q.topicid); // change later to include alert
      }
    });
  }
})

app.get('/submitEdit', function(request, response) {
	var q = request.query;
  var ses = request.session;
	if(!request.user) {
    ses.alert = true;
    ses.alertType = "alert-error";
    ses.alertText = "You must be logged in to edit site content.";
    response.redirect('/problem/' + q.problemName);
	}
	else {
    async.series([
      function(callback) {
        SingleEdit.saveEdit(request.user._id, q.problemId, q.problemOldSection, q.problemSection, q.sectionName, q.problemOldText, q.problemNewText);
        callback();
      }], function(err) {
        if(err) return next(err);
        response.redirect('/problem/' + q.problemId);
      });
	}
});

app.get('/newSection', function(request, response) {
  var q = request.query;
  var ses = request.session;
  if(!request.user) {
    ses.alert = true;
    ses.alertType = "alert-error";
    ses.alertText = "You must be logged in to edit site content.";
    response.redirect('/problem/' + q.problemName);
  }
  else {
    async.series([
      function(callback) {
        NewSection.newSection(q.name, q.section, q.sectionName, parseInt(q.sectionNumber));
        callback();
      }], function(err) {
        if(err) return next(err);
        response.redirect('/problem/' + q.name);
      });
  }
});

app.get('/newField', function(request, response) {
  var q = request.query;
  var ses = request.session;
  if(!request.user) {
    ses.alert = true;
    ses.alertType = "alert-error";
    ses.alertText = "You must be logged in to create a new field.";
    response.redirect('/categories/' + q.currentField);
  }
  else {
    async.series([
      function(callback) {
        NewField.newField(q.name, q.nid);
        callback();
      }], function(err) {
        if(err) return next(err);
        response.redirect('/categories/' + q.nid);
      });
  }
});

app.get('/sandboxEdit', function(request, response) {
  var q = request.query;
  var ses = request.session;
  if(!request.user) {
    ses.alert = true;
    ses.alertType = "alert-error";
    ses.alertText = "You must be logged in to edit your sandbox.";
    response.redirect(request.headers.referer || "/");
  } else {
    // update user sandbox
    User.update({_id: request.user}, {$set: {"sandbox":q.sandboxNewText}}, function(err, result) {
      if(err) {
        console.log(err);
        response.redirect('/servererror');
      }
      else {
        response.redirect('/dashboard');
      }
    });
  }
});

app.get('/newCarouselItem', function(request, response) {
  var q = request.query;
  var ses = request.session;
  if(!request.user) {
    console.log("not valid superuser (submitting a carousel item).");
    response.redirect("/notFound");
  } else if(ses.passport.user != process.env.PASSPORT_SUPERUSER) {
    console.log("not valid superuser (submitting a carousel item).");
    response.redirect("/notFound");
  } else {
    async.series([
      function(callback) {
        NewCarouselItem.newCarouselItem(q.number, q.pic, q.url, q.color, q.text, q.subtext);
        callback();
      }], function(err) {
        if(err) return next(err);
        response.redirect(request.headers.referer || "/");
      });
  }
});

app.get('/newFAQ', function(request, response) {
  var q = request.query;
  var ses = request.session;
  if(!request.user) {
    console.log("not valid superuser (submitting an FAQ question).");
    response.redirect("/notFound");
  } else if(ses.passport.user != process.env.PASSPORT_SUPERUSER) {
    console.log("not valid superuser (submitting an FAQ question).");
    response.redirect("/notFound");
  } else {
    async.series([
      function(callback) {
        NewFAQ.newFAQ(q.number, q.question, q.answer);
        callback();
      }], function(err) {
        if(err) return next(err);
        response.redirect('/faq');
      });
  }
});

app.get('/faq', function(request, response) {
  FAQ.find({}, function(err, list) {
    if(err) {
      console.log(err);
      response.redirect("/servererror");
    } else {
      render2("faq", {navid:4, questions: list}, request, response);
    }
  });
});

app.get('/logout', function(request, response) {
	request.logout();
  var ses = request.session;
  ses.alert = true;
  ses.alertType = "alert-success";
  ses.alertText = "Successfully logged out.";
	response.redirect('/');
});

app.get('/dashboard', function(request, response) {
	var ses = request.session;
	if(!request.user) {
    ses.alert = true;
    ses.alertType = "alert-error";
    ses.alertText = "You are not logged in.";
		response.redirect(request.headers.referer || "/");
	}
	else {
      Edit.find({user: request.user._id}, function(err,list) {
        if(err) {
          console.log(err);
          response.redirect("/servererror");
        }
        else {
          render2("dashboard", {
          navid:5, 
          edits: list
        }, request, response);
        }
    });
  }
});

app.get('/superuser', function(request, response) {
  if(!request.user) {
    console.log("not valid superuser.");
    response.redirect("/notFound");
  } else if(request.session.passport.user != process.env.PASSPORT_SUPERUSER) {
    console.log("not valid superuser.");
    response.redirect("/notFound");
  } else {
    console.log("valid superuser");
    FAQ.find({}, function(err, questions) {
      CarouselItem.find({}, function(err2, items) {
        render2("superuser", {questions: questions, carouselItems: items}, request, response);
      });
    });
  }
});

app.get('/sortProblems', function(request, response) {
  if(!request.user) {
    console.log("not valid superuser (sort problem sections).");
    response.redirect("/notFound");
  } else if(request.session.passport.user != process.env.PASSPORT_SUPERUSER) {
    console.log("not valid superuser (sort problem sections).");
    response.redirect("/notFound");
  } else {
    console.log("valid superuser");
    Problem.update({}, 
    {$push: {"content": {
      $each: [],
      $sort: {"sectionNumber": 1},
      $slice: Infinity
    }}}, function(err, result) {
      if(err) {
        console.log(err);
        response.redirect('/servererror');
      } else {
        response.redirect(request.headers.referer || '/problem/collatz');
      }
    });
  }
});

app.get('/acknowledgements', function(request, response) {
  render2("acknowledgements", {}, request, response);
});

app.get('/servererror', function(request, response) {
  render2("servererror", {}, request, response);
})

app.get('*', function(request, response) {
  render2('notFound', {user: request.user}, request, response);
});

// start the server
http.createServer(app).listen(app.get('port'), function() {
  console.log("Listening on " + app.get('port'));
});





