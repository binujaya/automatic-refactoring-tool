//node compareExpression.js

var jsdiff = require('diff');
 
//var one = 'salary = fsalary * 4;';
//var other = 'salary = salary * 2;';
 
var commonPart = [];
var addPart = [];
var removePart = [];

var checkDifference = function(comparator,comparison){
	var diff = jsdiff.diffWords(comparator, comparison);
	
	diff.forEach(function(part){
		// addPart array for additions, removePart array for deletions 
		// commonPart array for common parts 
		var diff = part.added ? addPart.push(part.value) :
			part.removed ? removePart.push(part.value) : commonPart.push(part.value);	
	});
	
}

var print = function(){
	console.log("Common Part " );
	commonPart.forEach(function(value) {
		console.log(value);
	});

	console.log("Add Part ");
	addPart.forEach(function(value) {
		console.log(value);
	});

	console.log("Remove Part ");
	removePart.forEach(function(value) {
		console.log(value);
	});
} 

var compare = function() {
	var flag = false;
	if (commonPart.length >= 2){
		if (addPart.length == 1 && removePart.length == 1){
			flag = true;
		}
	} 
	setArrayEmpty();
	//console.log("Able to parameterize: "+flag);
	return flag;
}

var setArrayEmpty = function() {
	commonPart.length = 0;
	addPart.length = 0;
	removePart.length = 0;
}

//checkDifference('salary = salary * 4;', 'salary = salary * 2;');
//print();
//compare();

module.exports = {
  checkDifference: checkDifference,
  print : print,
  compare: compare,
  setArrayEmpty: setArrayEmpty
};