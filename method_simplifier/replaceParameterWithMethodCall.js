// node replaceParameterWithMethodCall.js

var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var jsonfile = require('jsonfile');

var code = 'function getFees(){} function getSeasonalDiscount(){}  function discountedPrice(arg1,arg2,arg3){} var fees = getFees(); var basePrice = quantity * itemPrice; var seasonDiscount = getSeasonalDiscount(); var finalPrice = discountedPrice(basePrice,seasonDiscount,fees);';
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
				console.log(arguments);
			}
		}
	},
	leave: (node) => {
		len--;
	}
	});
	
}

refacController(ast);