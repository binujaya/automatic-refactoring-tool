//node removeParameter.js

var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var jsonfile = require('jsonfile');

var codeString = 'function myFunction(x, y) {return x * y; } function sumation(x,y,z){var result = x+y}';
var ast = esprima.parse(codeString);	
console.log('\n Befor Refactoring\n');
//console.log(JSON.stringify(ast, null, 4));
var code = escodegen.generate(ast);
console.log(code + "\n"); 



function isContainedInMethodBody(parentNode, parameterName){
	var  count = 0;
	estraverse.traverse(ast, {
		leave : function (node,parent) {
			if(node.type =='Identifier' && node.name == parameterName){
				count++;
			}	
		}
	});
	
	return count;
}

estraverse.traverse(ast, {
	enter : function (node, parent) {
		if(node.type =='FunctionDeclaration' && node.params.length > 0){
			console.log(JSON.stringify(node.id.name)); 
			for (var i=0; i<node.params.length; i++){
				var para = node.params[i].name;
				console.log(JSON.stringify(para));
				var paraCount = isContainedInMethodBody(node,para);
				console.log("Count :" + JSON.stringify(paraCount));
			}
			
		}
	}
});




