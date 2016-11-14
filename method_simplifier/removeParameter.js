/* run command
	node removeParameter.js */

// import libraries
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var jsonfile = require('jsonfile');

/* Test Script 
var codeString = 'var a = 10000; (function (a) {alert();})(); function test(b){alert();} var testFun = function(b){alert();}';
var ast = esprima.parse(codeString);
console.log('\n Befor Refactoring\n');
//console.log(JSON.stringify(ast, null, 4));
var code = escodegen.generate(ast);
console.log(code + "\n");  */

// check whether parameter is contain in method booy
function isContainedInMethodBody(parentNode, parameterName,ast){
	var  count = 0;
	estraverse.traverse(parentNode, {
		enter : function (node,parent) {
			if(node.type =='Identifier' && node.name == parameterName){
				count++;
			}	
		}
	});
	
	return count;
}

// remove parameter from parameter list
function removeParameter(parentNode, parameterName,ast){
	estraverse.replace(parentNode, {
		enter: function (node,parent){
			if('Identifier' === node.type  && parameterName === node.name){
				return this.remove();
			}	
		}
	});
}

// modify method callee palces
function editFunctionCallee(functionName, parameterPosision,ast){
	estraverse.replace(ast, {
		enter : function (node, parent) {
			if(parent.type =='CallExpression' && parent.callee.type== 'Identifier' && parent.callee.name === functionName ){
				if(node == parent.arguments[parameterPosision]){
					return this.remove();
				}
			}
		}
	});
}

// search unused parameters
var searchRemoveParameter = function(ast){
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if((node.type =='FunctionDeclaration' || node.type == 'FunctionExpression') && node.params.length > 0){
				for (var i=0; i<node.params.length; i++){
					var para = node.params[i].name;
					console.log(JSON.stringify(para));
					var paraCount = isContainedInMethodBody(node,para,ast);
					console.log("Count :" + JSON.stringify(paraCount));
				
					if (paraCount == 1){
						removeParameter(node,para,ast);
					}
					// ignore anonymous functions
					if (node.id != null){
						var functionName = node.id.name;
						console.log(JSON.stringify(node.id.name)); 
						editFunctionCallee(functionName,i,ast);
					}
				}
			
			}
		}
	});
}

/* Test Script 
searchRemoveParameter(ast);
console.log('\n After Refactoring\n');
//console.log(JSON.stringify(ast, null, 4));
var refactoredCode = escodegen.generate(ast);
console.log(refactoredCode); */

module.exports = {
  searchRemoveParameter: searchRemoveParameter,
  editFunctionCallee : editFunctionCallee,
  removeParameter: removeParameter,
  isContainedInMethodBody: isContainedInMethodBody
  
};