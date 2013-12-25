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
  , SingleEdit = require('./models/singleEdit')
  , NewProblem = require('./models/newProblem')
  , NewSection = require('./models/newSection');

  
// SET UP THE APP
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set("view options", {layout: false}); // from http://stackoverflow.com/questions/13765315/opening-html-file-using-express-js
app.set('port', process.env.PORT || 8080);
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret:'secretkey'}));
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
app.get('/auth/facebook', facebookAuth.facebookAuth());
app.get('/auth/facebook/callback', facebookAuth.facebookAuthWithCallback());

// Twitter login and callbacks
app.get('/auth/twitter', twitterAuth.twitterAuth());
app.get('/auth/twitter/callback', twitterAuth.twitterAuthWithCallback());

// Google login and callbacks
app.get('/auth/google', googleAuth.googleAuth());
app.get('/auth/google/callback', googleAuth.googleAuthWithCallback());
	

var render2 = function(destination, options, request, response) {
	Field.find({}, function(err, fieldList) {
		options.fields = fieldList;
		response.render(destination, options);
	});
}


// Render homepage (note trailing slash): example.com/
app.get('/', function(request, response) {
    var caption1 = {
      pic: '/assets/img/soap-bubble-63982_1280.jpg',
      url: '/',
      color: 'gold',
      text: 'The Unsolved Problems Database',
      subtext: 'Learn about the world\'s greatest mysteries.'
    };
    var caption2 = {
      pic: '/assets/img/logo.svg',
      url: '/problem/collatz',
      color: 'red',
      text: 'Collatz Conjecture',
      subtext: 'Mathematics -- Number Theory'
    };
    var caption3 = {
      pic: '/assets/img/ball-72374_640.jpg',
      url: '/problem/beal',
      color: 'white',
      text: 'Beal\'s Conjecture',
      subtext: 'Mathematics -- Number Theory'
    };
    render2("index", {
        navid: 1,
        user: request.user,
        carouselItems: [
          caption1,
          caption2,
          caption3
        ]
    }, request, response);
});

app.get('/about', function(request, response) {
    render2("about", {navid:2, user: request.user}, request, response);
});

app.get('/contact', function(request, response) {
    render2("contact", {navid:3, user: request.user}, request, response);
});

app.get('/problem/:probName', function(request, response) {
	var problem = Problem.findOne({nid:request.params.probName}, function(err, result) {
    if(!err) {
      if(result == null) {
        render2("notFound", {user: request.user}, request, response);
      } else {
      render2("problem/problem", {problem: result, alert: false, user: request.user}, request, response);
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
        render2("notFound", {user: request.user}, request, response);
      } else {
      var problems = Problem.find({topic: result.name}, function(error, result2) {
        render2("categories/field", {field: result, problems: result2, user: request.user}, request, response);
      });
      }
    } else {
      console.log(err);
    }
	});
});

app.get('/submitEdit', function(request, response) {
	var q = request.query;
	if(!request.user) {
		Problem.findOne({nid:q.problemName}, function(err, result) {
			render2('problem/problem', {problem: result, alert: true, alertType: "alert-error",
			alertText: "You must be logged in to edit site content.", user: request.user}, request, response);
		});
	}
	else {
		SingleEdit.saveEdit(request.user._id, q.problemName, q.problemSection, q.problemOldText, q.problemNewText);
		response.redirect('/problem/' + q.problemName);
	}
});

app.get('/sandboxEdit', function(request, response) {
  var q = request.query;
  if(!request.user) {
    response.redirect("/");
  } else {
    // update user sandbox
    User.update({_id: request.user}, {$set: {"sandbox":q.sandboxNewText}}, function(err, result) {
      if(err) {
        console.log(err);
        response.redirect('/dashboard');
      }
      else {
        response.redirect('/dashboard');
      }
    });
  }
})

app.get('/faq', function(request, response) {
    render2("faq", {navid:4, user: request.user}, request, response);
});

app.get('/logout', function(request, response) {
	request.logout();
	response.redirect('/');
});

app.get('/dashboard', function(request, response) {
  console.log(request.url);
	// from https://github.com/sjuvekar/3Dthon/blob/master/route/index.js on 6 September 2013
	if(!request.user) {
		response.redirect("/");
	}
	else {
      Edit.find({user: request.user._id}, function(err,list) {
        if(err) {
          console.log("err: " + err);
          response.redirect("/");
        }
        else {
          render2("dashboard", {
          navid:5, 
          user: request.user,
          edits: list,
          alert: false
        }, request, response);
        }
    });
  }
});

app.get('/acknowledgements', function(request, response) {
  render2("acknowledgements", {user:request.user}, request, response);
});

app.get('*', function(request, response) {
  render2('notFound', {user: request.user}, request, response);
});

// start the server
http.createServer(app).listen(app.get('port'), function() {
  console.log("Listening on " + app.get('port'));
});





