// node replaceParameterWithMethodCall.js

var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var jsonfile = require('jsonfile');

/* //Test Script 
var code = 'function getFees(){} function getSeasonalDiscount(){}  var discountedPrice = function(arg1,arg2,arg3){}; var fees = getFees(); var basePrice = quantity * itemPrice; var seasonDiscount = getSeasonalDiscount(); var finalPrice = discountedPrice(basePrice,seasonDiscount,fees);';
var ast = esprima.parse(code);	
//console.log(JSON.stringify(ast, null, 4));
var bCode = escodegen.generate(ast);
console.log("Before Reactoring");
console.log(bCode); */

var len = 0;

var getArguments = function(nodeObject){
	var argArray = [];
	estraverse.traverse(nodeObject, {
		enter : function (node,parent) {
			if(node.arguments != null){
				node.arguments.forEach(function(value) {
					argArray.push(value.name);
				});
			}
		}
	});
	return argArray;
}

var checkArguments = function(ast,arguments){
	var removeParameter = {};
	for(var i=0; i<arguments.length; i++){
		var count = variableUsage(ast,arguments[i]);
		if (count >= 2){
			var node = isGlobalVaribale(ast,arguments[i]);
			var remove = removable(node);
			if(node != null && remove){
				removeParameter[i] = node;
			}
		}
	}
	return removeParameter;
}

var removable = function(nodeObj){
	var falg = false;
	estraverse.traverse(nodeObj, {
		enter : function (node,parent) {
			if(node.type == 'VariableDeclaration'){
				if(node.declarations[0].init.type == 'CallExpression' && node.declarations[0].init.arguments.length == 0){
					falg = true;
				}
			}
		}
	});
	return falg;
}

var isGlobalVaribale = function(ast,name){
	var temp = null;
	estraverse.traverse(ast, {
		enter : function (node,parent) {
			if(node.type == 'VariableDeclaration' && parent != null && parent.type == 'Program' ){
				if(node.declarations[0].id.type == 'Identifier' && node.declarations[0].id.name == name){
					temp = node;
				}
			}
		}
	});
	return temp;
}

var variableUsage = function(ast,name){
	var count = 0;
	estraverse.traverse(ast, {
		enter : function (node,parent) {
			if(node.type == 'Identifier' && node.name == name){
				if(parent.type == 'VariableDeclarator' || parent.type == 'CallExpression'){
					count++;
				}
			}
		}
	});
	return count;
}

var getCalleeCount = function(ast,name){
	var count = 0;
	estraverse.traverse(ast, {
		enter : function (node,parent) {
			if(node.type =='CallExpression' && node.callee.type == 'Identifier' && node.callee.name == name){
				count++;
			}
		}
	});
	return count;
}

var removePara = function(nodeObj,paraList){
	estraverse.traverse(nodeObj, {
		enter : function (node,parent) {
			if(node.type =='FunctionDeclaration' && node.id.type == 'Identifier' ){
				paraList.forEach(function(para) {
					var idx = node.params.indexOf(para);
					node.params.splice(idx, 1);
				});
			}
			if(node.type =='FunctionExpression' && node.id == null ){
				paraList.forEach(function(para) {
					var idx = node.params.indexOf(para);
					node.params.splice(idx, 1);
				});
			}
		}
	});
}

var changeMethodBody = function(ast,name,removeParameter){
	var paraList = [];
	estraverse.traverse(ast, {
		enter : function (node,parent) {
			if(node.type =='FunctionDeclaration' && node.id.type == 'Identifier' && node.id.name == name){
				var indexes = Object.keys(removeParameter);
				indexes.forEach(function(index) {
					var replaceNode = removeParameter[index];
					var argName = node.params[index].name;
					replaceNode.declarations[0].id.name = argName;
					node.body.body.unshift(replaceNode);
					paraList.push(argName);
				});
				removePara(node,paraList);
			}
			if(node.type =='FunctionExpression' && node.id == null && parent.id.name == name){
				var indexes = Object.keys(removeParameter);
				indexes.forEach(function(index) {
					var replaceNode = removeParameter[index];
					var argName = node.params[index].name;
					replaceNode.declarations[0].id.name = argName;
					node.body.body.unshift(replaceNode);
					paraList.push(argName);
				});
				removePara(node,paraList);
			}
		}
	});
}

var garbageDeleter = function(deleteNodeList,ast){
	var indexes = Object.keys(deleteNodeList);
	indexes.forEach(function(index) {
		var garbageNode = deleteNodeList[index];
		var name = garbageNode.declarations[0].id.name
		estraverse.replace(ast, {
			enter: function (node,parent){
				if(node.type == 'VariableDeclaration' && parent != null && parent.type == 'Program' ){
					if(node.declarations[0].id.type == 'Identifier' && node.declarations[0].id.name == name){
						return this.remove();
					}
				}	
			}
		});
	});
}

var refacController = function(ast){
	var argList = [];
	estraverse.traverse(ast, {
		enter: (node, parent) => {
		len++;
		if(node.type =='CallExpression' && node.callee.type == 'Identifier' && node.arguments.length > 0 && len<=4){
			var name = node.callee.name;
			var calleeCount = getCalleeCount(ast,name);
			if(calleeCount == 1){
				var arguments = getArguments(node);
				var removeParameter = checkArguments(ast,arguments);
				if(removeParameter != null){
					changeMethodBody(ast,name,removeParameter);
					var removeIndx= Object.keys(removeParameter);
					removeIndx.forEach(function(arg) {
						argList.push(node.arguments[arg].name);
					});
					argList.forEach(function(arg) {
						var idx = node.arguments.indexOf(arg);
						node.arguments.splice(idx, 1);
					});
					garbageDeleter(removeParameter,ast);
				}
			}
		}
	},
	leave: (node) => {
		len--;
	}
	});
	
}

module.exports = {
  refacController: refacController,
  getCalleeCount:getCalleeCount,
  getArguments : getArguments,
  checkArguments:checkArguments,
  removable:removable,
  isGlobalVaribale:isGlobalVaribale,
  variableUsage: variableUsage,
  removePara:removePara,
  changeMethodBody:changeMethodBody,
  garbageDeleter:garbageDeleter
};

/* //Test Script
refacController(ast);
console.log('\n After Refactoring\n');
//console.log(JSON.stringify(ast, null, 4));
var refactoredCode = escodegen.generate(ast);
console.log(refactoredCode);  */