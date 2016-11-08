// Run Command - node paramerterizedMethod.js

var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var jsonfile = require('jsonfile');
var compareExpression = require('./compareExpression.js');

/* Test Script - before 

var codeString = 'var salary = 10000; function fivePresentAdd(){ salary = salary + 5;}  function test(a){alert();} function fivePresentRise(){ salary *= 5;} function tenPresentAdd(){ salary = salary + 10;} function tenPresentRise(){ salary *= 10;} fivePresentRise(); tenPresentAdd();';
var ast = esprima.parse(codeString);
console.log('\n Befor Refactoring\n');
console.log(JSON.stringify(ast, null, 4));
var code = escodegen.generate(ast);
console.log(code + "\n");  
 */
 
var n = 1;
var nodes = []; 

var trivialNodes = {
  ExpressionStatement : 'ExpressionStatement',
}

// checked if the node is trivial node
var isTrivialNode = function (node) {
  return Object.keys(trivialNodes).some(function (key) {
    return key==node.type;
  });
}

/* identify methods that contain trivial node  and 
			push their names to nodes array   */
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

// remove specific elements from nodes array
var remove = function(value){
	var idx = nodes.indexOf(value);
	nodes.splice(idx, 1); 
}

/* match methods for identiy duplicates and 
		check whether their are suitable for parameterize   */
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

// parameterize duplicate methods
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
		editFunctionCallee(ast,comparatorName,comparatorValue,newName);
		editFunctionCallee(ast,comparisonName,comparisonvalue,newName);
		removeMethoods(ast,comparisonName);
	}
	else if(assignment == '='){
		comparatorValue = comparatorNode.body.body[0].expression.right.right.value;
		comparisonvalue = comparisonNode.body.body[0].expression.right.right.value;
		comparatorNode = createNewMethod2(comparatorNode,newName);
		editFunctionCallee(ast,comparatorName,comparatorValue,newName);
		editFunctionCallee(ast,comparisonName,comparisonvalue,newName);
		removeMethoods(ast,comparisonName);
	}
	
}

// return node body of given function
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

// generate code of given node object
var generateCode = function (nodeObject){
	
	var code = escodegen.generate(nodeObject,{format:{newline: '', semicolons: false}});
	return code;
}

// return node for given function
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

// create new paramerterized method for assignment operator
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

// create new paramerterized method for equal operator
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

// remove methods by giving name 
var removeMethoods = function(ast, name){
	estraverse.replace(ast, {
		enter: function (node,parent){
			if(node.type =='FunctionDeclaration' && node.id.type =='Identifier' && node.id.name == name){
				return this.remove();
			}
		}
	});
}

// edit function callee places to new function name
var editFunctionCallee = function(ast,pastName,argValue,newName){
	estraverse.replace(ast, {
		enter : function (node, parent) {
			if(parent.type =='CallExpression' && parent.callee.type== 'Identifier' && parent.callee.name === pastName ){
				parent.callee.name = newName;
				var argument = {type: "Literal", value: argValue, raw: argValue}
				parent.arguments.push(argument);
			}
		}
	});
}

// start search
var searchParameterizeMethods = function(){
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if(node.type =='FunctionDeclaration' && node.id.type =='Identifier' && node.params.length == 0){
				identifyTrivialNodes(ast,node);	
			}		
		}
	});
}

/* Test Script - After refactoring

searchParameterizeMethods();
matchDuplicatemethods(ast);

console.log('\n After Refactoring\n');
console.log(JSON.stringify(ast, null, 4));
var refactoredCode = escodegen.generate(ast);
console.log(refactoredCode); */

module.exports = {
  searchParameterizeMethods: searchParameterizeMethods,
  identifyTrivialNodes : identifyTrivialNodes,
  isTrivialNode : isTrivialNode,
  remove : remove,
  matchDuplicatemethods : matchDuplicatemethods,
  methodParameterizer :  methodParameterizer,
  getNodeBody : getNodeBody,
  generateCode : generateCode,
  getNode : getNode,
  createNewMethod1 : createNewMethod1,
  createNewMethod2 : createNewMethod2,
  removeMethoods : removeMethoods,
  editFunctionCallee : editFunctionCallee
};