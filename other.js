// inspired by http://stackoverflow.com/questions/12134554/node-js-external-js-and-css-fiels-just-using-node-js-not-express

var http = require('http');
var fs = require('fs');
var port = process.env.PORT || 8080;


http.createServer(function (req, res) {
	if(req.url.indexOf('.html') != -1){ //req.url has the pathname, check if it conatins '.html'

      fs.readFile(__dirname + '/public/chatclient.html', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });

    }

    if(req.url.indexOf('.js') != -1){ //req.url has the pathname, check if it conatins '.js'

      fs.readFile(__dirname + '/public/js/script.js', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data);
        res.end();
      });

    }

    if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'

      fs.readFile(__dirname + '/public/css/style.css', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });

    }
}).listen(port, function() {
	console.log("Listening on " + port);
});