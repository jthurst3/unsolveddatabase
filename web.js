// inspired by http://stackoverflow.com/questions/12134554/node-js-external-js-and-css-fiels-just-using-node-js-not-express

var express = require('express');
var fs = require('fs');
var app = express.createServer(express.logger());
var port = process.env.PORT || 8080;

// technique from https://github.com/sjuvekar/3Dthon/blob/master/web.js
app.use("/assets", express.static(__dirname + "/assets"));

var index = "index.php";
var about = "about.html";
var contact = "contact.html";
var header = "header.php";
var collatz = "problem/collatz.html";
var style = "assets/css/mainStyle.css";
//var logo = "Calabi-Yau-alternate.png";


app.get('/', function(request, response) {
  var buffer = new Buffer(fs.readFileSync(index));
  response.send(buffer.toString());
});

app.get('/about', function(request, response) {
	var buffer = new Buffer(fs.readFileSync(about));
	response.send(buffer.toString());
});

app.get('/contact', function(request, response) {
	var buffer = new Buffer(fs.readFileSync(contact));
	response.send(buffer.toString());
});

app.get('/header', function(request, response) {
	var buffer = new Buffer(fs.readFileSync(header));
	response.send(buffer.toString());
});

app.get('/problem/collatz', function(request, response) {
	var buffer = new Buffer(fs.readFileSync(collatz));
	response.send(buffer.toString());
});

app.get('/style', function(request, response) {
	var buffer = new Buffer(style);
	response.send(buffer.toString());
});

/*app.get('/pic', function(request, response) {
	var buffer = new Buffer(fs.readFilesync(logo));
	response.send(buffer.toString());
});*/

app.listen(port, function() {
	console.log("Listening on " + port);
});
