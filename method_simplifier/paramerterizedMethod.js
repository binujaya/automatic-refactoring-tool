//node paramerterizedMethod.js

var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var jsonfile = require('jsonfile');
var compareExpression = require('./compareExpression.js');

var codeString = 'var salary = 10000; function fivePresentAdd(){ salary = salary + 5;} function fivePresentRise(){ salary *= 5;} function tenPresentAdd(){ salary = salary + 10;} function tenPresentRise(){ salary *= 10;}';
var ast = esprima.parse(codeString);
//console.log('\n Befor Refactoring\n');
//console.log(JSON.stringify(ast, null, 4));
var code = escodegen.generate(ast);
//console.log(code + "\n");
var n = 1;
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
			var comparatorCode = generateCode(getNodeBody(ast, nodes[key]));	
			for (var currentKey in nodes){
				if(currentKey != key){
					var comparisonCode = generateCode(getNodeBody(ast, nodes[currentKey]));
					compareExpression.checkDifference(comparatorCode,comparisonCode);
					var ableToParameterize = compareExpression.compare();

					if (ableToParameterize){
						methodParameterizer(ast,nodes[key],nodes[currentKey]);
						remove(nodes[key]);
						remove(nodes[currentKey -1]);
						break;
					}
				}
			}
		}
	}
	
}

var methodParameterizer = function(ast,comparatorName, comparisonName){
	var comparatorNode = getNode(ast, comparatorName);
	var comparisonNode = getNode(ast, comparisonName); 
	var newName = "parameterizeMethod_" + n++;
	
	/*console.log(JSON.stringify(comparatorNode,null, 4));
	console.log(JSON.stringify(getNode(ast,"parameterizeMethod1"),null, 4));*/
	
	var assignment = comparatorNode.body.body[0].expression.operator;
	var comparatorValue, comparisonvalue;
	
	if(assignment == '+=' | assignment == '-=' | assignment == '*=' | assignment == '/=' | assignment == '%='){
		comparatorValue = comparatorNode.body.body[0].expression.right.value;
		comparisonvalue = comparisonNode.body.body[0].expression.right.value;
		comparatorNode = createNewMethod1(comparatorNode,newName);
	}
	else if(assignment == '='){
		comparatorValue = comparatorNode.body.body[0].expression.right.right.value;
		comparisonvalue = comparisonNode.body.body[0].expression.right.right.value;
		comparatorNode = createNewMethod2(comparatorNode,newName);
	}
	
}

var getNode = function(ast, nodeName){
	var tempnode, assignment;
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if(node.type =='FunctionDeclaration' && node.id.type =='Identifier' && node.id.name == nodeName){
				tempnode = node;
			}		
		}
	});
	return tempnode;
}

var createNewMethod1 = function(comparatorNode,newName){
	var temp = comparatorNode;
	temp.id.name = newName;
	var parameter = {"type": "Identifier","name": "new_parameter"}
	temp.params.push(parameter)
	
	var rightNode = {type: "Identifier", name: "new_parameter"};
	temp.body.body[0].expression.right = rightNode;
	
	//console.log(JSON.stringify(temp, null, 4));
	return temp;
}

var createNewMethod2 = function(comparatorNode,newName){
	var temp = comparatorNode;
	temp.id.name = newName;
	var parameter = {"type": "Identifier","name": "new_parameter"}
	temp.params.push(parameter)
	
	var rightNode = {type: "Identifier", name: "new_parameter"};
	temp.body.body[0].expression.right.right = rightNode;
	
	//console.log(JSON.stringify(temp, null, 4));
	return temp;
}

var getNodeBody = function(ast, nodeName){
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

console.log('\n After Refactoring\n');
//console.log(JSON.stringify(ast, null, 4));
var refactoredCode = escodegen.generate(ast);
console.log(refactoredCode);
