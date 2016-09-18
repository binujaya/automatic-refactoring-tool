var fs = require('fs');
var esprima = require('esprima');
var escodegen = require('escodegen');

var MethodComposer = require('./method_composer/index.js');
var MethodSimplifier;
var ConditionalSimplifier;

var refactoredCode;

fs.readFile('./inputFile.js', 'utf8', function (err,data) {
  if (err) {
    throw err;
  }

  var ast = esprima.parse(data);
  // console.log('\n AST BEFORE REFACTORING: \n');
  // console.log(JSON.stringify(ast , null, 4));

  //insert refactoring modules here
  MethodComposer.testRefactor(ast, 'getGrade');
  MethodComposer.addDepthToNodes(ast);
  //MethodComposer.printNode('BlockStatement', ast);

  refactoredCode = escodegen.generate(ast);

  fs.writeFile('./outputFile.js', refactoredCode, function (err) {
    if (err) {
      throw err;
    }
  });
});
