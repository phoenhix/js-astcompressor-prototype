#!/usr/bin/nodejs --harmony-collections

require('./astutil.js');
require('./encoding.js');

var esprima = require('./Upstream/esprima/esprima.js');
var js2webasm = require('./js2webasm.js');
var fs = require('fs');

if (process.argv.length !== 5) {
  console.log("USAGE: js2webasm input.js output.webasm astOutput.json");
  process.exit(1);
}

var inputFile = process.argv[2];
var outputFile = process.argv[3];
var outputAstFile = process.argv[4];

var inputJs = fs.readFileSync(inputFile, { encoding: "utf8" });
var fdOut = fs.openSync(outputFile, "w");

var inputAst = esprima.parse(inputJs);
var outputModule = js2webasm.astToModule(inputAst);

var segments = js2webasm.serializeModule(outputModule);
for (var i = 0; i < segments.length; i++) {
  var segment = segments[i];
  var buffer = new Buffer(segment);
  fs.writeSync(fdOut, buffer, 0, segment.length);
}

fs.closeSync(fdOut);

fs.writeFileSync(outputAstFile, JSON.stringify(inputAst));