// Define routes for simple SSJS web app. 
// Writes Coinbase orders to database.
// Login strategies and mongoose initialization inspired by Sudeep Juvekar's repository: https://github.com/sjuvekar/3Dthon
// Persistent sessions inspired by http://stackoverflow.com/questions/7990890/how-to-implement-login-auth-in-node-js

// use correct environment
/*var env = require('node-env-file');
env(__dirname + '/.env');*/

// IMPORT STATEMENTS
var async   = require('async')
  , express = require('express')
  , fs      = require('fs')
  , http    = require('http')
  , https   = require('https')
  , db      = require('./models')
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
  , SingleEdit = require('./models/singleEdit');

  
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
	//console.log(request);
	// get info on crowdfunding process. Modified from https://github.com/sjuvekar/3Dthon/blob/master/web.js
	/*global.db.Order.findAll().success(function(orders) {
		var numBackers = orders.length;
		var totalBitcoins = 0;
		orders.forEach(function(order) {
			totalBitcoins += order.amount;
		});
		var percentFunded = totalBitcoins / 4 * 100;
		render2("index", {
				backers: numBackers, 
				bitcoins: totalBitcoins.toFixed(4), 
				percent: percentFunded, 
				user: request.user,
				navid:1
		}, request, response);
	}).error(function(err) {
		console.log(err);
		response.render(index);
	});*/
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
  //var data = fs.readFileSync(index).toString();
  //response.send(data);
});

app.get('/about', function(request, response) {
    render2("about", {navid:2, user: request.user}, request, response);
});

app.get('/contact', function(request, response) {
    render2("contact", {navid:3, user: request.user}, request, response);
});

app.get('/problem/:probName', function(request, response) {
	var problem = Problem.findOne({nid:request.params.probName}, function(err, result) {
    render2("problem/problem", {problem: result, alert: false, user: request.user}, request, response);
		/*Section.find({}, function(error, sectionList) {
      var sectionContent = result.content;
			render2("problem/problem", {problem: result, alert: false, sections: sectionList, user: request.user}, request, response);
		})*/
	});
});

app.get('/categories/:field', function(request, response) {
	var category = Field.findOne({nid:request.params.field}, function(err, result) {
		var problems = Problem.find({topic: result.name}, function(err, result2) {
			render2("categories/field", {field: result, problems: result2, user: request.user}, request, response);
		});
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

/*app.get('/signup', function(request, response) {
	if(request.user) {
		render2("dashboard", {
			navid:5,
			user: request.user,
			alert: true,
			alertType: "alert-warn",
			alertText: "You are already logged in."
		}, request, response);
	}
	else {
		render2("signup", {}, request, response);
	}
});*/

app.get('/logout', function(request, response) {
	request.logout();
	response.redirect('/');
})

app.get('/dashboard', function(request, response) {
  console.log(request.url);
	// from https://github.com/sjuvekar/3Dthon/blob/master/route/index.js on 6 September 2013
	if(!request.user) {
		response.redirect("/");
	}
	else {
      // LEFT OFF HERE: FIX EDIT LISTING FOR USERS WITH >1 EDIT
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


// Render example.com/orders
/*app.get('/orders', function(request, response) {
  global.db.Order.findAll().success(function(orders) {
    var orders_json = [];
    orders.forEach(function(order) {
      orders_json.push({id: order.coinbase_id, amount: order.amount, time: order.time});
    });
    // Uses views/orders.ejs
    response.render("orders", {orders: orders_json});
  }).error(function(err) {
    console.log(err);
    response.send("error retrieving orders");
  });
});*/

// Hit this URL while on example.com/orders to refresh
/*app.get('/refresh_orders', function(request, response) {
  https.get("https://coinbase.com/api/v1/orders?api_key=" + process.env.COINBASE_API_KEY, function(res) {
    var body = '';
    res.on('data', function(chunk) {body += chunk;});
    res.on('end', function() {
      try {
        var orders_json = JSON.parse(body);
        if (orders_json.error) {
          response.send(orders_json.error);
          return;
        }
        // add each order asynchronously
        async.forEach(orders_json.orders, addOrder, function(err) {
          if (err) {
            console.log(err);
            response.send("error adding orders");
          } else {
            // orders added successfully
            response.redirect("/orders");
          }
        });
      } catch (error) {
        console.log(error);
        response.send("error parsing json");
      }
    });

    res.on('error', function(e) {
      console.log(e);
      response.send("error syncing orders");
    });
  });

});*/

// sync the database and start the server
/*db.sequelize.sync().complete(function(err) {
  if (err) {
    throw err;
  } else {
    http.createServer(app).listen(app.get('port'), function() {
      console.log("Listening on " + app.get('port'));
    });
  }
});*/

// add order to the database if it doesn't already exist
/*var addOrder = function(order_obj, callback) {
  var order = order_obj.order; // order json from coinbase
  if (order.status != "completed") {
    // only add completed orders
    callback();
  } else {
    var Order = global.db.Order;
    // find if order has already been added to our database
    Order.find({where: {coinbase_id: order.id}}).success(function(order_instance) {
      if (order_instance) {
        // order already exists, do nothing
        callback();
      } else {
        // build instance and save
          var new_order_instance = Order.build({
          coinbase_id: order.id,
          amount: order.total_btc.cents / 100000000, // convert satoshis to BTC
          time: order.created_at
        });
          new_order_instance.save().success(function() {
          callback();
        }).error(function(err) {
          callback(err);
        });
      }
    });
  }
};*/

app.get('*', function(request, response) {
  render2('notFound', {user: request.user}, request, response);
})

// start the server
http.createServer(app).listen(app.get('port'), function() {
      console.log("Listening on " + app.get('port'));
    });

/*app.get('/', function(request, response) {
  var buffer = new Buffer(fs.readFileSync(index));
  response.send(buffer.toString());
});*/