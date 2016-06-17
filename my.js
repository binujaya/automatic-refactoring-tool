var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');

var code = 'var answer = 42; var result = 0; if(answer>20)result=10 ; function f1(){} function f2(){}';

var ast = esprima.parse(code);	

//console.log('\n Befor Refactoring\n');
//console.log(JSON.stringify(ast, null, 4));

estraverse.traverse(ast, {
  enter : function (node, parent) {
    if(parent='FunctionDeclaration' && node.type=='Identifier' && node.name.length <= 3){
		
		var methodName = input();
		node.name = methodName;
    }
  }
});

var refactoredCode = escodegen.generate(ast);

console.log('\n After Refactoring\n');
console.log(JSON.stringify(refactoredCode, null, 4));