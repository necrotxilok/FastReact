var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

var build = require("./node/build");

var port = process.argv[2] || 3000;

var contentTypesByExtension = {
	'.html': "text/html",
	'.css':  "text/css",
	'.js':   "text/javascript"
};

var server = http.createServer(function(request, response) {
	console.log('Received new request ' + request.url);

	var headers = {};
	var content = "";
	var uri = url.parse(request.url).pathname;

	// Build JS App Script
	if (uri == '/scripts.js') {
		content = build();
		response.writeHead(200, {"Content-Type": "text/javascript"});
		response.write(content);
		response.end();
		return;
	}

	// Static Files
	var filePath = path.join(process.cwd(), 'www', uri);
	if (uri.endsWith('/')) {
		filePath = path.join(filePath, 'index.html');
	}

	if (!fs.existsSync(filePath)) {
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not Found\n");
		response.end();
		return;
	}

	var ext = path.extname(filePath);
	var contentType = contentTypesByExtension[ext];
	if (contentType) {
		headers["Content-Type"] = contentType;
		content = fs.readFileSync(filePath, 'utf8');
	} else {
		content = fs.readFileSync(filePath);
	}

	response.writeHead(200, headers);
	response.write(content);
	response.end();
});

server.listen(port);

console.log("Static file server running at http://localhost:" + port + "/");
console.log(" CTRL + C to shutdown\n");
