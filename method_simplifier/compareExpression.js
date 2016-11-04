//node testPara.js

var jsdiff = require('diff');
 
var one = 'salary = fsalary * 4;';
var other = 'salary = salary * 2;';
 
var diff = jsdiff.diffWords(one, other);

var commonPart = [];
var addPart = [];
var removePart = [];
var flag = false;
 
diff.forEach(function(part){
	// addPart array for additions, removePart array for deletions 
	// commonPart array for common parts 
	var diff = part.added ? addPart.push(part.value) :
		part.removed ? removePart.push(part.value) : commonPart.push(part.value);	
});

console.log("Common Part");
commonPart.forEach(function(value) {
  console.log(value);
});

console.log("Add Part");
addPart.forEach(function(value) {
  console.log(value);
});

console.log("Remove Part");
removePart.forEach(function(value) {
  console.log(value);
});

if (commonPart.length > 3){
	if (addPart.length == 1 && removePart.length == 1){
		flag = true;
	}
} 
console.log(flag);
