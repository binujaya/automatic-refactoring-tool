var fs = require('fs');

var MethodExtraction = require('./method_extraction/index.js');

var esprima = require('esprima');
var estraverse = require('estraverse');

fs.readFile('./inputFile.js','utf8', function (err,data) {
  if (err) {
    throw err;
  }

  var ast = esprima.parse(data);

  console.log('\n AST BEFORE REFACTORING: \n');
  console.log(JSON.stringify(ast, null, 4));

  //insert refactoring modules here
  MethodExtraction(ast);

});
