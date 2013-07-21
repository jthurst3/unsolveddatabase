// inspired by http://stackoverflow.com/questions/12134554/node-js-external-js-and-css-fiels-just-using-node-js-not-express

var http = require('express');
var fs = require('fs');
var port = process.env.PORT || 8080;

var index = "index.html";
var about = "about.html";
var logo = "Calabi-Yau-alternate.png";
var style = "mainStyle.css";


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

app.get('/style', function(request, response) {
	var buffer = new Buffer(fs.readFilesync(style));
	response.send(buffer.toString());
});

app.listen(port, function() {
	console.log("Listening on " + port);
});
