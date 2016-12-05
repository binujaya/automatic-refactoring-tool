// node replaceParameterWithMethodCall.js

var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var jsonfile = require('jsonfile');

var code = 'function getFees(){} function getSeasonalDiscount(){}  function discountedPrice(basePrice,seasonDiscount,fees){} var fees = getFees(); var basePrice = quantity * itemPrice; var seasonDiscount = getSeasonalDiscount(); var finalPrice = discountedPrice(basePrice,seasonDiscount,fees);';
var ast = esprima.parse(code);	
console.log(JSON.stringify(ast, null, 4));
var bCode = escodegen.generate(ast);
console.log(bCode);

var len = 0;

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
				}
			}
		}
	},
	leave: (node) => {
		len--;
	}
	});
	
}

refacController(ast);
console.log('\n After Refactoring\n');
//console.log(JSON.stringify(ast, null, 4));
var refactoredCode = escodegen.generate(ast);
console.log(refactoredCode); 