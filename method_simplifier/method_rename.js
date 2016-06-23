//nodemon method_rename.js
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');


var code = 'var answer = 42; var x = 0; if(answer>20)x=10 ; function f1(){alert("test");} function f2(){} f1();';

var ast = esprima.parse(code);	

//console.log('\n Befor Refactoring\n');
//console.log(JSON.stringify(ast, null, 4));



var n = 1;

function renameMethod(node,num){
	var pastName, newName;
	var newMethodName = 'RenameMethod_' + num;
	pastName = node.id.name;
	newName = newMethodName;
	console.log('Method name is too short: ',node.id.name);
	node.id.name = newMethodName;
	renameCallee(pastName,newName);
	return node;
}

function renameCallee(pastName,newName){
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if(node.type =='ExpressionStatement' && node.expression.type=='CallExpression' && node.expression.callee.name === pastName ){
				node.expression.callee.name = newName;
			}
		}
	});
}	

estraverse.traverse(ast, {
	enter : function (node, parent) {
		if(node.type =='FunctionDeclaration' && node.id.type=='Identifier' && node.id.name.length <= 3){
			renameMethod(node,n);
			n = n + 1;
		}
	}
});

var refactoredCode = escodegen.generate(ast);

console.log('\n After Refactoring\n');
console.log(refactoredCode); 