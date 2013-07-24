// inspired by http://stackoverflow.com/questions/12134554/node-js-external-js-and-css-fiels-just-using-node-js-not-express

var express = require('express');
var fs = require('fs');
var app = express.createServer(express.logger());
var port = process.env.PORT || 8080;

// technique from https://github.com/sjuvekar/3Dthon/blob/master/web.js
app.use(express.static("/assets"));

var index = "index.html";
var about = "assets/css/about.html";
var contact = "contact.html";
var collatz = "problem/collatz.html";
//var logo = "Calabi-Yau-alternate.png";


app.get('/', function(request, response) {
  var buffer = new Buffer(fs.readFileSync(index));
  response.send(buffer.toString());
});

app.get('/css/about', function(request, response) {
	var buffer = new Buffer(fs.readFileSync(about));
	response.send(buffer.toString());
});

app.get('/contact', function(request, response) {
	var buffer = new Buffer(fs.readFileSync(contact));
	response.send(buffer.toString());
});

app.get('/problem/collatz', function(request, response) {
	var buffer = new Buffer(fs.readFileSync(collatz));
	response.send(buffer.toString());
});

/*app.get('/pic', function(request, response) {
	var buffer = new Buffer(fs.readFilesync(logo));
	response.send(buffer.toString());
});

app.get('/style', function(request, response) {
	var buffer = new Buffer(fs.readFilesync(style));
	response.send(buffer.toString());
});*/

app.listen(port, function() {
	console.log("Listening on " + port);
});
