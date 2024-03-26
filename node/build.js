var fs = require("fs");
var path = require("path");

var vendorPath = path.join(process.cwd(), 'src', 'libs');
var appPath = path.join(process.cwd(), 'src', 'app');

const getAllFiles = function(dirPath) {
	var filesList = [];
	var files = fs.readdirSync(dirPath);

	files.forEach(function(file) {
		var filePath = path.join(dirPath, file);
		if (fs.statSync(filePath).isDirectory()) {
			filesList = filesList.concat(getAllFiles(filePath));
		} else {
			filesList.push(filePath);
		}
	})

	return filesList;
}

const buildPath = function(dirPath) {
	var content = "";
	var files = getAllFiles(dirPath);
	files.forEach(function(file) {
		script = fs.readFileSync(file, 'utf8');
		content += '(function() {\n"use strict";\n\n' + script + '\n})();\n';
	});
	return content;
}

module.exports = function() {
	var scripts = "";

	scripts += buildPath(vendorPath);
	scripts += buildPath(appPath);

	return scripts;
}