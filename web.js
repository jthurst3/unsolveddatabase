var express = require('express');

var app = express.createServer(express.logger());

var fs = require('fs');

var about = "about.html";
var logo = "Calabi-Yau-alternate.png";


app.get('/', function(request, response) {
  var buffer = new Buffer(fs.readFileSync("index.html"));
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

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
