var fs = require('fs');
var express = require('express');
var app = express();
var path = require('path');
var esprima = require('esprima');
var escodegen = require('escodegen');

var MethodComposer = require('./method_composer/index.js');
var MethodSimplifier;
var ConditionalSimplifier;

var refactoredCode;

app.post('/sourcecode', function (req, res) {

})

fs.readFile('./method_composer/inputFile4.js', 'utf8', function (err,data) {
  if (err) {
    throw err;
  }

  var ast = esprima.parse(data);
  //console.log('\n AST BEFORE REFACTORING: \n');
  //console.log(JSON.stringify(ast , null, 4));

  //method composer module
  MethodComposer.addDepthToNodes(ast);
  MethodComposer.removeAssignToParam(ast);
  MethodComposer.addInlineMethods(ast);
  MethodComposer.extractVariables(ast);
  MethodComposer.extractMethods(ast);

  //ConditionalSimplifier module

  //console.log(JSON.stringify(ast, null, 4));

  refactoredCode = escodegen.generate(ast);

  fs.writeFile('./method_composer/outputFile.js', refactoredCode, function (err) {
    if (err) {
      throw err;
    }
  });
  fs.writeFile('./method_composer/AST.js', JSON.stringify(ast, null, 4), function (err) {
    if (err) {
      throw err;
    }
  });
  app.get('/refactoredcode', function (req, res) {
    res.sendFile(path.join(__dirname+'/method_composer/outputFile.js'));
  });
  app.listen(1337);
  console.log('Refactored code served at port 1337, url /refactoredcode');
});
