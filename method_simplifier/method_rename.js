/* run command 
	node method_rename.js */

// import libraries
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var jsonfile = require('jsonfile');

// JSON array for keep old & new method's names
var methodNames = {};
// JSON file contain methodNames array
var file = 'data.json';

var n = 1;

// rename short method names to generic name
function renameMethod(node,num,ast){
	
	var pastMethodName, newMethodName;
	if(node.id.type == 'Identifier'){
		console.log(node.id.name + ' method name is too short.');
		newMethodName = "RenameMethod_"+ num;
		pastMethodName = node.id.name;	
		node.id.name = newMethodName;
		console.log(pastMethodName +' rename as ' + node.id.name);
		renameCallee(pastMethodName,newMethodName,ast);
	
		methodNames[newMethodName] = pastMethodName;
	}
}

// replace old names by new name in callee places
function renameCallee(pastName,newName,ast){
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if(node.type=='CallExpression' && node.callee.type== 'Identifier' && node.callee.name === pastName ){
				node.callee.name = newName;
			}
		}
	});
}	

// search short name methods
var searchMethodsName = function(ast){
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if(node.type =='FunctionDeclaration' && node.id.type == 'Identifier' && node.id.name.length <= 3){
				renameMethod(node,n,ast);
				n = n + 1;
			}
			else if(node.type == 'FunctionExpression' && parent.id.type == 'Identifier' && parent.id.name.length <= 3){
				renameMethod(parent,n,ast);
				n = n + 1;
			}
		}
	});
}

// write JSON array to file
var writeData = function(){
	jsonfile.writeFile(file, methodNames, {spaces: 2}, function(err) {
		if (err) {
			return console.error(err);
		}
		console.log("Data written successfully!");
	});
}

module.exports = {
  searchMethodsName: searchMethodsName,
  writeData : writeData
};