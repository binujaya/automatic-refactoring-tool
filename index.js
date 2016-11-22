var fs = require('fs');
var esprima = require('esprima');
var escodegen = require('escodegen');

var MethodComposer = require('./method_composer/index.js');
var MethodSimplifier;
var ConditionalSimplifier;

var refactoredCode;

fs.readFile('./method_composer/inputFile4.js', 'utf8', function (err,data) {
  if (err) {
    throw err;
  }

  var ast = esprima.parse(data);
  //console.log('\n AST BEFORE REFACTORING: \n');
  //console.log(JSON.stringify(ast , null, 4));

  //insert refactoring modules here
  //MethodComposer.renameMethod(ast, 'myFunc', 'myFunc2');
  // MethodComposer.addDepthToNodes(ast);
  //MethodComposer.printNode('BlockStatement', ast);
  // MethodComposer.removeAssignToParam(ast);
  // MethodComposer.addInlineMethods(ast);
  // MethodComposer.extractVariables(ast);
  MethodComposer.extractMethods(ast);

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
});
