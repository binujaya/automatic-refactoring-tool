//nodemon method_rename.js
//node method_rename.js
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var jsonfile = require('jsonfile');

var code = 'function f1(){alert("test");} function sum(){return 1+2;} function getSumation(){sum();} function f2(){} f1(); var getData = f2();';

var ast = esprima.parse(code);	

var methodNames = {};
var file = 'data.json';

console.log('\n Befor Refactoring\n');
console.log(JSON.stringify(ast, null, 4));

var n = 1;

function renameMethod(node,num){
	var pastMethodName, newMethodName;
	
	console.log(node.id.name + ' method name is too short.');
	newMethodName = "RenameMethod_"+ num;
	pastMethodName = node.id.name;	
	node.id.name = newMethodName;
	console.log(pastMethodName +' rename as ' + node.id.name);
	renameCallee(pastMethodName,newMethodName);
	
	methodNames[newMethodName] = pastMethodName;
		
	return node;
}

function renameCallee(pastName,newName){
	estraverse.traverse(ast, {
		enter : function (node, parent) {
			/* if(node.type =='ExpressionStatement' && node.expression.type=='CallExpression' && node.expression.callee.name === pastName ){
				node.expression.callee.name = newName;
			} */
			if(node.type=='CallExpression' && node.callee.type== 'Identifier' && node.callee.name === pastName ){
				node.callee.name = newName;
			}
		}
	});
}	

estraverse.traverse(ast, {
	enter : function (node, parent) {
		if(node.type =='FunctionDeclaration' && node.id.type=='Identifier' && node.id.name.length <= 3){
			renameMethod(node,n);
			n = n + 1;
		}
	}
});

var refactoredCode = escodegen.generate(ast);

console.log('\n After Refactoring\n');
console.log(refactoredCode); 

console.log('\n New & Past Methods names\n');
console.log(JSON.stringify(methodNames)); 

console.log('\nData write to json file');
jsonfile.writeFile(file, methodNames, {spaces: 2}, function(err) {
   if (err) {
       return console.error(err);
   }
   console.log("Data written successfully!");
});

