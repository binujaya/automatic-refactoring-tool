/* run command
	node remove_parameter_main.js */

// import libraries
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');

// import method_rename.js module
var MethodSimplifier = require('./removeParameter.js');

var refactoredCode;

// read input file
fs.readFile('./input/input_removeParameter_1.js', 'utf8', function (err,data) {
  if (err) {
    throw err;
  }

  var ast = esprima.parse(data);

  MethodSimplifier.searchRemoveParameter(ast);

  //generate the refactored code
  refactoredCode = escodegen.generate(ast);

  // write to refactored code to a file
  fs.writeFile('outputFile.js', refactoredCode, function (err) {
    if (err) {
      throw err;
    }
  });
});
