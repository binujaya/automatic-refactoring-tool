//node paramerterizedMethod.js

var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var jsonfile = require('jsonfile');
var compareExpression = require('./compareExpression.js');

var codeString = 'var salary = 10000; function fivePresentRise(){ salary = salary + (salary * 4);} function tenPresentRise(){ salary = salary + (salary * 2);}';
var ast = esprima.parse(codeString);
//console.log('\n Befor Refactoring\n');
//console.log(JSON.stringify(ast, null, 4));
var code = escodegen.generate(ast);
//console.log(code + "\n");

var nodes = []; 

var trivialNodes = {
  ExpressionStatement : 'ExpressionStatement',
}

var isTrivialNode = function (node) {
  return Object.keys(trivialNodes).some(function (key) {
    return key==node.type;
  });
}

var identifyTrivialNodes = function (ast,parentNode){
	var succ_count = 0;
	var unsucc_count = 0;
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if(parent === parentNode.body){
				if (isTrivialNode(node))succ_count += 1;
				else unsucc_count += 1; 
			}
		},
		leave : function (node, parent) {
			if(node === parentNode && succ_count == 1 && unsucc_count == 0){
				nodes.push(node.id.name);
			}
		}
	});
}

var remove = function(value){
	var idx = nodes.indexOf(value);
	nodes.splice(idx, 1); 
}

var matchDuplicatemethods = function (ast){
	while(nodes.length > 1){
		for(var key in nodes) {
			var comparatorCode = generateCode(getNode(ast, nodes[key]));	
			for (var currentKey in nodes){
				if(currentKey != key){
					var comparisonCode = generateCode(getNode(ast, nodes[currentKey]));
					compareExpression.checkDifference(comparatorCode,comparisonCode);
					var ableToParameterize = compareExpression.compare();

					if (ableToParameterize){
						remove(nodes[key]);
						remove(nodes[currentKey]);
						break;
					}
					remove(nodes[key]);
				}
			}
		}
	}
	
}

var getNode = function(ast, nodeName){
	var tempnode;
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if(node.type =='FunctionDeclaration' && node.id.type =='Identifier' && node.id.name == nodeName){
				tempnode = node.body; 
			}		
		}
	});
	return tempnode;
}

var generateCode = function (nodeObject){
	
	var code = escodegen.generate(nodeObject,{format:{newline: '', semicolons: false}});
	return code;
}

estraverse.traverse(ast, {
	enter : function (node, parent) {
		if(node.type =='FunctionDeclaration' && node.id.type =='Identifier' ){
			identifyTrivialNodes(ast,node);	
		}		
	}
});

matchDuplicatemethods(ast);

/*for(var key in nodes) {
	console.log("key: " + key);
	var code = escodegen.generate(nodes[key].body.body);
	console.log(JSON.stringify(code));	
}*/

//console.log('\n After Refactoring\n');
//console.log(JSON.stringify(ast, null, 4));
