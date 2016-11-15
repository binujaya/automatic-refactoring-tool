/* run command 
		node paramerterizedMethod.js */

// import libraries
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var jsonfile = require('jsonfile');
var compareExpression = require('./compareExpression.js');

/* //Test Script - Befor refactoring
var code = 'function tenPointAdd(){ salary = salary + 10;} function tenPointRise(){ salary = salary * 10;} var fivePointAdd = function(){ salary = salary + 5;}; var fivePointRise = function(){ salary = salary * 5;}; fivePointAdd(); tenPointAdd(); fivePointRise(); tenPointRise();';
var ast = esprima.parse(code);	
//console.log(JSON.stringify(ast, null, 4));
var bCode = escodegen.generate(ast);
console.log(bCode); */

var n = 1;
var nodes = [];
var trivialNodes = {
  ExpressionStatement : 'ExpressionStatement',
} 

// start to search methods which can be parameter
var searchParameterizeMethods = function(ast){
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if(node.type =='FunctionDeclaration' && node.params.length == 0){
				var sentNode = node.body;
				var name = node.id.name;
				identifyTrivialNodes(sentNode,name);	
			}
			else if(node.type =='FunctionExpression' && node.params.length == 0){
				var sentNode = node.body;
				var name = parent.id.name;
				identifyTrivialNodes(sentNode,name);
			}
		}
	});
}

/* identify methods that contain trivial node  and 
			push their names to nodes array   */
var identifyTrivialNodes = function (nodeObject,name){
	var succ_count = 0;
	var unsucc_count = 0;
	estraverse.traverse(nodeObject, {
		enter : function (node, parent) {
			if(parent === nodeObject){
				if (isTrivialNode(node))succ_count += 1;
				else unsucc_count += 1; 
			}
		},
		leave : function (node, parent) {
			if(node === nodeObject && succ_count == 1 && unsucc_count == 0){
				nodes.push(name);
			}
		}
	});
}

// checked if the node is trivial node
var isTrivialNode = function (node) {
  return Object.keys(trivialNodes).some(function (key) {
    return key==node.type;
  });
}

/* match methods for identiy duplicates and 
		check whether their are suitable for parameterize   */
var matchDuplicatemethods = function (ast){
	while(nodes.length > 1){
		for(var key in nodes) {
			var comparatorCode = generateCode(getNodeBody(ast, nodes[key]));
			var similarity = false;
			for (var currentKey in nodes){
				if(currentKey != key){
					var comparisonCode = generateCode(getNodeBody(ast, nodes[currentKey]));
					compareExpression.checkDifference(comparatorCode,comparisonCode);
					var ableToParameterize = compareExpression.compare();

					if (ableToParameterize){
						methodParameterizer(ast,nodes[key],nodes[currentKey]);
						remove(nodes[key]);
						remove(nodes[currentKey -1]);
						similarity = true;
						break;
					}
				}
			}
			if(similarity == false){
				remove(nodes[key-1]);
			}
		}
	}
}

// return node body of given function
var getNodeBody = function(ast, nodeName){
	var tempnode;
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if(node.type =='FunctionDeclaration' && node.id.name == nodeName){
				tempnode = node.body; 
			}
			else if(node.type =='FunctionExpression' && parent.id.name == nodeName){
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

// remove specific elements from nodes array
var remove = function(value){
	var idx = nodes.indexOf(value);
	nodes.splice(idx, 1); 
}

// parameterize duplicate methods
var methodParameterizer = function(ast,comparatorName, comparisonName){
	var comparatorNode = getNode(ast, comparatorName);
	var comparisonNode = getNode(ast, comparisonName); 
	var newName = "parameterizeMethod_" + n++;
	var comparisontype = comparisonNode.type;
	
	/*console.log(JSON.stringify(comparatorNode,null, 4));
	console.log(JSON.stringify(getNode(ast,"parameterizeMethod1"),null, 4));*/
	
	var assignment = comparatorNode.body.body[0].expression.operator;
	var comparatorValue, comparisonvalue;
	
	if(assignment == '+=' | assignment == '-=' | assignment == '*=' | assignment == '/=' | assignment == '%='){
		comparatorValue = comparatorNode.body.body[0].expression.right.value;
		comparisonvalue = comparisonNode.body.body[0].expression.right.value;
		createNewMethod1(ast,comparatorName,newName);
		editFunctionCallee(ast,comparatorName,comparatorValue,newName);
		editFunctionCallee(ast,comparisonName,comparisonvalue,newName);
		removeMethoods(ast,comparisonName,comparisontype);
	}
	else if(assignment == '='){
		comparatorValue = comparatorNode.body.body[0].expression.right.right.value;
		comparisonvalue = comparisonNode.body.body[0].expression.right.right.value;
		createNewMethod2(ast,comparatorName,newName);
		editFunctionCallee(ast,comparatorName,comparatorValue,newName);
		editFunctionCallee(ast,comparisonName,comparisonvalue,newName);
		removeMethoods(ast,comparisonName,comparisontype);
	}
	
}

// return node for given function name
var getNode = function(ast, nodeName){
	var tempnode, assignment;
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if(node.type =='FunctionDeclaration' && node.id.type =='Identifier' && node.id.name == nodeName){
				tempnode = node;
			}
			else if(node.type =='FunctionExpression' && parent.id.type =='Identifier' && parent.id.name == nodeName){
				tempnode = node;
			}
		}
	});
	return tempnode;
}

// create new paramerterized method for assignment operators
var createNewMethod1 = function(ast,pastName,newName){
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if(node.type =='FunctionDeclaration' && node.id.type == 'Identifier' && node.id.name == pastName){
				node.id.name = newName;
				var parameter = {"type": "Identifier","name": "new_parameter"}
				node.params.push(parameter)
	
				var rightNode = {type: "Identifier", name: "new_parameter"};
				node.body.body[0].expression.right = rightNode;
			}
			else if(node.type =='FunctionExpression' && parent.id.type == 'Identifier' && parent.id.name == pastName){
				parent.id.name = newName;
				var parameter = {"type": "Identifier","name": "new_parameter"}
				node.params.push(parameter)
				
				var rightNode = {type: "Identifier", name: "new_parameter"};
				node.body.body[0].expression.right = rightNode;
			}
		}
	});
}

// create new paramerterized method for equal operator
var createNewMethod2 = function(ast,pastName,newName){
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if(node.type =='FunctionDeclaration' && node.id.type == 'Identifier' && node.id.name == pastName){
				node.id.name = newName;
				var parameter = {"type": "Identifier","name": "new_parameter"}
				node.params.push(parameter)
	
				var rightNode = {type: "Identifier", name: "new_parameter"};
				node.body.body[0].expression.right.right = rightNode;
			}
			else if(node.type =='FunctionExpression' && parent.id.type == 'Identifier' && parent.id.name == pastName){
				parent.id.name = newName;
				var parameter = {"type": "Identifier","name": "new_parameter"}
				node.params.push(parameter)
				
				var rightNode = {type: "Identifier", name: "new_parameter"};
				node.body.body[0].expression.right.right = rightNode;
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

// remove methods by giving name 
var removeMethoods = function(ast, name,type){
	if (type == 'FunctionDeclaration'){
		estraverse.replace(ast, {
			enter: function (node,parent){
				if(node.type =='FunctionDeclaration' && node.id.type =='Identifier' && node.id.name == name){
					return this.remove();
				}
			}
		});
	}
	else if (type == 'FunctionExpression'){
		estraverse.replace(ast, {
			enter: function (node,parent){
				if(node.type == 'VariableDeclaration' && node.declarations[0].id.name == name && node.declarations[0].init.type == 'FunctionExpression'){
					return this.remove();
				}
			}
		});
	}
	
}

/* //Test Script - After refactoring
searchParameterizeMethods(ast);
matchDuplicatemethods(ast);
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