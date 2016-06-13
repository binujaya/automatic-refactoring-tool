var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');

var code = 'var answer = 42; var result = 0; if(answer>20)result=10 ;';

var ast = esprima.parse(code);

estraverse.traverse(ast, {
  enter : function (node, parent) {
    if(node.type=='Identifier' && node.name=='answer'){
      node.name = 'x';
    }
  }
});

var refactoredCode = escodegen.generate(ast);

console.log(JSON.stringify(refactoredCode, null, 4));
