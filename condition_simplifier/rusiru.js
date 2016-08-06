var fs = require('fs');


var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');

fs.readFile('./input.js','utf8', function (err,data) {
  if (err) {
    throw err;
  }

var code = 'if (discount) { amount = price * 0.90; printBill();}';
console.log(data);
var ast = esprima.parse(data);
console.log('\n AST BEFORE REFACTORING: \n');
console.log(JSON.stringify(ast, null, 4));
    

estraverse.replace(ast, {
  enter: function enter(node) {
    if (
        'ExpressionStatement' === node.type
      && 'CallExpression' === node.expression.type
      && 'printBill' === node.expression.callee.name
    ) {
      return this.remove();
    }
  }
});

code = escodegen.generate(ast, {
  format: {
    indent: { style: '  ' }
  }
});

console.log(code);
    
});