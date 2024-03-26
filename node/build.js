var fs = require("fs");
var path = require("path");

module.exports = function(uri) {
	var jsPath = path.join(process.cwd(), 'www', uri);
	var jsxPath = path.join(process.cwd(), 'src', uri).replace('.js', '.jsx');
	if (!fs.existsSync(jsxPath)) {
		return;
	}

	var needRefresh = false;
	if (fs.existsSync(jsPath)) {
		var jsxStats = fs.statSync(jsxPath);
		var compiledStats = fs.statSync(jsPath);
		if (compiledStats.mtimeMs < jsxStats.mtimeMs) {
			needRefresh = true;
		}
	} else {
		needRefresh = true;
	}

	if (needRefresh) {
		console.log('Change detected in ' + jsxPath + '!');
		var script = fs.readFileSync(jsxPath, 'utf8');
		var content = '(function() {\n"use strict";\n\n' + script + '\n})();';
		fs.writeFileSync(jsPath, content, 'utf8'); 
		console.log('Compilation Success!');
	}
};