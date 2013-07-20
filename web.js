var express = require('express');

var app = express.createServer(express.logger());

var fs = require('fs');

var index = "index.html";
var about = "about.html";
var logo = "Calabi-Yau-alternate.png";
//var style = "mainStyle.css";


app.get('/', function(request, response) {
  var buffer = new Buffer(fs.readFileSync(index));
  response.send(buffer.toString());
});

app.get('/about', function(request, response) {
	var buffer = new Buffer(fs.readFileSync(about));
	response.send(buffer.toString());
});

app.get('/pic', function(request, response) {
	var buffer = new Buffer(fs.readFilesync(logo));
	response.send(buffer.toString());
});

/*app.get('/mainStyle', function(request, response) {
	var buffer = new Buffer(fs.readFilesync(style));
	response.send(buffer.toString());
});*/

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
