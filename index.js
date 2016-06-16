var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');

var code = 'var answer = 42; var result = 0; if(answer>20)result=10 ;';

var ast = esprima.parse(code);

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
