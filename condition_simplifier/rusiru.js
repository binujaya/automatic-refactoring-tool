var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');

var data = 'var answer = 42;';

var ast = esprima.parse(data);

console.log('\n AST BEFORE REFACTORING: \n');
console.log(JSON.stringify(ast, null, 4));

var changeAST = function (ast) {
    estraverse.traverse(ast, {
        enter: function (node, parent) {

            if (node.type == 'Identifier' && node.name == 'answer') {
                node.name = 'refactoredAnswer';
            }
        }
    });
};

changeAST(ast);

var refactoredCode = escodegen.generate(ast);

console.log('\n\n REFACTORED CODE: \n');
console.log(refactoredCode);