var fs = require('fs');

var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');

app = {};

fs.readFile('./inputFile.js','utf8', function (err,data) {
  if (err) {
    throw err;
  }

  var ast = esprima.parse(data);

  console.log('\n AST BEFORE REFACTORING: \n');
  console.log(JSON.stringify(ast, null, 4));

  estraverse.traverse(ast, {
    enter : function (node, parent) {
      if(node.type=='Identifier' && node.name=='answer'){
        node.name = 'x';
      }
    }
  });

  var refactoredCode = escodegen.generate(ast);

  console.log('\n\n REFACTORED CODE: \n');
  console.log(refactoredCode);
});
