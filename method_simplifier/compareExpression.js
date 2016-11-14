//node compareExpression.js

var jsdiff = require('diff');
 
//var comparator = 'salary = salary * 4;';
//var comparison = 'salary = salary * 2;';
 
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
			flag = validate();
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

var validate = function() {
	var isValid = false;
	
	if(addPart[0].match(/^\d+$/) && removePart[0].match(/^\d+$/)){
		isValid = true;
	}else if(addPart[0].match(/^\d+\.\d+$/) && removePart[0].match(/^\d+\.\d+$/)){
		isValid = true;
	}else if(addPart[0].match(/^\d+$/) && removePart[0].match(/^\d+\.\d+$/)){
		isValid = true;
	} else if(addPart[0].match(/^\d+\.\d+$/) && removePart[0].match(/^\d+$/)){
		isValid = true;
	}else{
		isValid = false;
	} 
	return isValid;
}

//checkDifference(comparator,comparison);
//print();
//compare();

module.exports = {
  checkDifference: checkDifference,
  print : print,
  compare: compare,
  setArrayEmpty: setArrayEmpty,
  validate: validate
};