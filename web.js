// Define routes for simple SSJS web app. 
// Writes Coinbase orders to database.
var async   = require('async')
  , express = require('express')
  , fs      = require('fs')
  , http    = require('http')
  , https   = require('https')
  , db      = require('./models');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8080);

// inspired by http://stackoverflow.com/questions/12134554/node-js-external-js-and-css-fiels-just-using-node-js-not-express
//var app = express.createServer(express.logger());
//var port = process.env.PORT || 8080;

// technique from https://github.com/sjuvekar/3Dthon/blob/master/web.js
app.use("/assets", express.static(__dirname + "/assets"));

var index = "index.html";
var about = "about.html";
var contact = "contact.html";
var faq = "faq.html";
var header = "header.htm";
var collatz = "problem/collatz.html";
var navbar = "navbar.html";

var style = "assets/css/mainStyle.css";
var github = "assets/css/github.css";

var math = "math.html";

// Render homepage (note trailing slash): example.com/
app.get('/', function(request, response) {
  var data = fs.readFileSync(index).toString();
  response.send(data);
});

app.get('/about', function(request, response) {
    var data = fs.readFileSync(about).toString();
    response.send(data);
});

app.get('/contact', function(request, response) {
    var data = fs.readFileSync(contact).toString();
    response.send(data);
});

app.get('/header', function(request, response) {
    var data = fs.readFileSync(header).toString();
    response.send(data);
});

app.get('/problem/collatz', function(request, response) {
    var data = fs.readFileSync(collatz).toString();
    response.send(data);
});

app.get('/navbar', function(request, response) {
    var data = fs.readFileSync(navbar).toString();
    response.send(data);
});

app.get('/math', function(request, response) {
    var data = fs.readFileSync(math).toString();
    response.send(data);
});

app.get('/faq', function(request, response) {
    var data = fs.readFileSync(faq).toString();
    response.send(data);
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