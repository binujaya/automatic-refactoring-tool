// node renamePoorName.js

// import libraries
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var jsonfile = require('jsonfile');

// import dictionary 
var Typo = require('typo-js'); 
var dictionary = new Typo('en_US');

/* //Test Script - before refactoring
var codeString = "var methodNameChecker12 = function (){}; methodNameChecker12()";
var ast = esprima.parse(codeString);
console.log('\n Befor Refactoring\n');
//console.log(JSON.stringify(ast, null, 4));
var code = escodegen.generate(ast);
console.log(code + "\n");  */

//var flags = []; 
var poorReadable = [];
var n = 1;

// check method's names are meaningful or not
var checkedName = function(nodeObject,methodName){
	
	var flags = []; 
	var name = removeNumbers(methodName);
	
	var upperCaseIndexs = checkUpperCase(name);
	var underscoreindexs = checkUnderscore(name);
	
	if(underscoreindexs.length != 0){
		for(var i = 0 ; i<=underscoreindexs.length;i++){
			if(i==0){
				var res = name.substring(0, underscoreindexs[0]);
				//console.log(res);
				flags.push(isMeaningful(res));
			}
			else{
				var res = name.substring(underscoreindexs[i-1]+1,underscoreindexs[i]);
				//console.log(res);
				flags.push(isMeaningful(res));
			}
		}
	}
	
	if(upperCaseIndexs.length != 0 && underscoreindexs.length == 0){
		for(var i = 0 ; i<=upperCaseIndexs.length; i++){
			if(i==0){
				var res = name.substring(0, upperCaseIndexs[i]);
				//console.log(res); 
				flags.push(isMeaningful(res));
			}
			else{
				var res = name.substring(upperCaseIndexs[i-1],upperCaseIndexs[i]);
				//console.log(res);
				flags.push(isMeaningful(res));
			}
		}
	}
	
	else if(upperCaseIndexs.length == 0 && underscoreindexs.length == 0){
		var check = isMeaningful(name);
		flags.push(check);
		/* if(!check){
			poorReadable.push(name);
		}  */
	}	

	var flag = createflag(flags);
	console.log("final "+flag);
	return flag;
}

// if method name contain number, remove them
var removeNumbers = function(methodName){
	var pattern = /[0-9]/g;
	var number =[];
	var match;
	while(match = pattern.exec(methodName)){
		number.push(match.index)
	}
	var res = methodName.substring(0,number[0]);
	console.log(res);
	return res;
	
}

// return upperCase character indexs
var checkUpperCase = function(methodName){
	var upperCase = [];
	var pattern1 = /[A-Z]/g;
	var match;
	while(match = pattern1.exec(methodName)){
		upperCase.push(match.index);
	}
	if(upperCase[0] == 0){
		upperCase.splice(0, 1); 
	}
	
	return upperCase;
}

// return underscore character indexs
var checkUnderscore = function(name){
	var indexs = [];
	var pattern = /[_]/g;
	var match;
	while(match = pattern.exec(name)){
		indexs.push(match.index);
	}
	return indexs;
}

// check whether given word is meaningful or not
var isMeaningful = function(word){
	var is_spelled_correctly = false;
	is_spelled_correctly = dictionary.check(word);
	console.log("Is correct word? "+ is_spelled_correctly);
	return is_spelled_correctly;
}

var createflag = function(flagArray){
	var checker = false;
	if(flagArray.length != 0){
		for(var m = 0; m<flagArray.length; m++){
			if(m==0){
				checker = flagArray[0];
				console.log("checker "+checker);
			}
			else{
				checker = checker && flagArray[m];
				console.log("checker "+checker);
			}
		}
	}
	return checker;
}

// rename poor names into generic name
function renameMethod(node,num,ast){
	
	var pastMethodName, newMethodName;
	if(node.id.type == 'Identifier'){
		pastMethodName = node.id.name;
		newMethodName = "renameMethod"+ num;
		/* if(poorReadable.indexOf(pastMethodName) == -1){
			newMethodName = "RenameMethod_"+ num;	
		}
		else{
			newMethodName = pastMethodName + num;
		} */
		node.id.name = newMethodName;
		console.log(pastMethodName +' rename as ' + node.id.name);
		renameCallee(pastMethodName,newMethodName,ast);
	}
}

// replace new names in callee places
function renameCallee(pastName,newName,ast){
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if(node.type=='CallExpression' && node.callee.type== 'Identifier' && node.callee.name === pastName ){
				node.callee.name = newName;
			}
		}
	});
}

// star search poor names
var searchMethodsName = function(ast){
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			if(node.type =='FunctionDeclaration' ){
				var isValidName = checkedName(node,node.id.name);
				if(!isValidName){
					renameMethod(node,n,ast);
					n = n + 1;
				}
			}
			else if(node.type == 'FunctionExpression' && parent.id.type == 'Identifier'){
				var isValidName = checkedName(parent,parent.id.name);
				if(!isValidName){
					renameMethod(parent,n,ast);
					n = n + 1;
				}
			}
		}
	});
}

/* // Test script - After Refactoring
searchMethodsName(ast);
console.log('\n After Refactoring\n');
//console.log(JSON.stringify(ast, null, 4));
var refactoredCode = escodegen.generate(ast);
console.log(refactoredCode); */

module.exports = {
  searchMethodsName: searchMethodsName,
  checkedName: checkedName,
  isMeaningful: isMeaningful,
  renameMethod: renameMethod,
  renameCallee: renameCallee,
  removeNumbers: removeNumbers,
  checkUpperCase: checkUpperCase,
  checkUnderscore: checkUnderscore,
  createflag: createflag
};