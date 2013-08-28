// Define routes for simple SSJS web app. 
// Writes Coinbase orders to database.
// Facebook login strategy followed mostly verbatim from PassportJS's guide to Facebook login: http://passportjs.org/guide/facebook/
var async   = require('async')
  , express = require('express')
  , fs      = require('fs')
  , http    = require('http')
  , https   = require('https')
  , db      = require('./models')
  , passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , flash = require('connect-flash');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set("view options", {layout: false}); // from http://stackoverflow.com/questions/13765315/opening-html-file-using-express-js
app.set('port', process.env.PORT || 8080);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(flash());

// technique from https://github.com/sjuvekar/3Dthon/blob/master/web.js
app.use("/assets", express.static(__dirname + "/assets"));

var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// Passport js sessions
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(id, done) {
    done(null, id);
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/"
  },
  function(accessToken, refreshToken, profile, done) {
	  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
	        return done(err, user);
	      });
  }
));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { 
    successRedirect: '/', 
    failureRedirect: '/' 
}));
									  

var index = "index.html";
var about = "about.html";
var contact = "contact.html";
var faq = "faq.html";
var collatz = "problem/collatz.html";

var style = "assets/css/mainStyle.css";
var github = "assets/css/github.css";

var math = "math.html";

// var headers = fs.readFileSync("headers.html").toString();

// Render homepage (note trailing slash): example.com/
app.get('/', function(request, response) {
	// get info on crowdfunding process. Modified from https://github.com/sjuvekar/3Dthon/blob/master/web.js
	global.db.Order.findAll().success(function(orders) {
		var numBackers = orders.length;
		var totalBitcoins = 0;
		orders.forEach(function(order) {
			totalBitcoins += order.amount;
		});
		var percentFunded = totalBitcoins / 4 * 100;
		response.render("index", {backers: numBackers, bitcoins: totalBitcoins.toFixed(4), percent: percentFunded});
	}).error(function(err) {
		console.log(err);
		response.render(index);
	});
  //var data = fs.readFileSync(index).toString();
  //response.send(data);
});

app.get('/about', function(request, response) {
    response.render("about");
});

app.get('/contact', function(request, response) {
    response.render("contact");
});

app.get('/problem/collatz', function(request, response) {
    response.render("problem/collatz");
});

app.get('/math', function(request, response) {
    var data = fs.readFileSync(math).toString();
    response.send(data);
});

app.get('/faq', function(request, response) {
    response.render("faq");
});

// Render example.com/orders
app.get('/orders', function(request, response) {
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
});

// Hit this URL while on example.com/orders to refresh
app.get('/refresh_orders', function(request, response) {
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

});

// sync the database and start the server
db.sequelize.sync().complete(function(err) {
  if (err) {
    throw err;
  } else {
    http.createServer(app).listen(app.get('port'), function() {
      console.log("Listening on " + app.get('port'));
    });
  }
});

// add order to the database if it doesn't already exist
var addOrder = function(order_obj, callback) {
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
};

/*app.get('/', function(request, response) {
  var buffer = new Buffer(fs.readFileSync(index));
  response.send(buffer.toString());
});*/