#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var rest = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

/*var assertURLExists = function(url, check) {
	// inspired by https://class.coursera.org/startup-001/forum/thread?thread_id=4073
	rest.get(url).on('complete', function(result) {
		if(result instanceof Error) {
			console.log('Error: '+result.message);
		} else {
			console.log(result);
			var r = new Buffer(result);
			var checkJson = checkHtmlFile_url(r, check);
 			 var outJson = JSON.stringify(checkJson, null, 4);
   			 console.log(outJson);
		}

	});


};*/

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};
var checkHtmlFile_url = function(htmlfile, checksfile) {
    $ = cheerio.load(htmlfile);
    var checks = JSON.parse(fs.readFileSync(checksfile)).sort();
	//console.log(checks);
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
		//console.log(present);
        out[checks[ii]] = present;
    }
	//console.log(out);
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f,  --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
		.option('-u, --url <url_file>', 'URL file to check', null)
        .parse(process.argv);
		
		var checkJson;
		if(program.url) {
			rest.get(program.url).on('complete', function(result) {
				if(result instanceof Error) {
					console.log('Error: '+result.message);
				} else {
					var r = new Buffer(result);
					checkJson = checkHtmlFile_url(r, program.checks);
				    var outJson = JSON.stringify(checkJson, null, 4);
				    console.log(outJson);
				}
			});
		} else {
    checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
}
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
