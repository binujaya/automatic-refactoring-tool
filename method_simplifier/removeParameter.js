//node removeParameter.js
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var jsonfile = require('jsonfile');

var code = 'function myFunction(x, y) {return x * y; } function sumation(x,y,z){result = x+y}';
var ast = esprima.parse(code);	
console.log('\n Befor Refactoring\n');
console.log(JSON.stringify(ast, null, 4));

estraverse.traverse(ast, {
	enter : function (node, parent) {
		if(node.type =='FunctionDeclaration' && node.params.length > 0){
			console.log(JSON.stringify(node.id.name)); 
			for (var i=0; i<node.params.length; i++){
				console.log(JSON.stringify(node.params[i].name)); 
			}
			
		}
	}
});




