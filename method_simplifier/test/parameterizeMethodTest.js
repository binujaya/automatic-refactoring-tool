var expect = require('chai').expect;
var esprima = require('esprima');
var estraverse = require('estraverse');

var paramerterizedMethod = require('../paramerterizedMethod.js');

var code1 = 'function tenPointAdd(){ salary += 10;} function fivePointAdd(){ salary += 5;}; fivePointAdd(); tenPointAdd();';
var code2 = 'var fivePointAdd = function(){ salary = salary + 5;}; var tenPointAdd = function(){ salary = salary + 10;};fivePointAdd(); tenPointAdd();';
var code3 = 'function tenPointAdd(){ salary = salary + 10;} var fivePointAdd = function(){ salary = salary + 5;}; fivePointAdd(); tenPointAdd();';
var code4 = 'var fivePointAdd = function(){ salary += 5;}; function tenPointAdd(){ salary += 10;} fivePointAdd(); tenPointAdd();';
var code5 = 'function tenPointAdd(){ salary = salary * 10;} var fivePointAdd = function(){ salary += 5;}; fivePointAdd(); tenPointAdd();';
var code6 = 'function tenPointAdd(){ salary = salary * 10;} var fivePointAdd = function(){ salary = salary + 5;}; fivePointAdd(); tenPointAdd();';
var code7 = 'function tenPointAdd(){ salary = salary + 10;} function ten(){balance = salary - 1000;} var fivePointAdd = function(){ salary = salary + 5;}; fivePointAdd(); tenPointAdd();';
var code8 = 'function tenPointAdd(){ salary = salary + 10;} function tenPointRise(){ salary = salary * 10;} var fivePointAdd = function(){ salary = salary + 5;}; var fivePointRise = function(){ salary = salary * 5;}; fivePointAdd(); tenPointAdd(); fivePointRise(); tenPointRise();';

describe('parameterizeMethod', function() {
	var ast8 = esprima.parse(code8);
	var count = 0;
  beforeEach(function() {
		paramerterizedMethod.searchParameterizeMethods(ast8);
		paramerterizedMethod.matchDuplicatemethods(ast8);
  })
  it('check ability to paramerterize couple of similar methods together', function() {
		var flag = false;
		estraverse.traverse(ast8, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' || node.type == 'FunctionExpression'){
					count++;
				}		
			}
		});
		expect (count).to.equal(2);
  })
})

describe('parameterizeMethod', function() {
	var ast1 = esprima.parse(code1);
  beforeEach(function() {
		paramerterizedMethod.searchParameterizeMethods(ast1);
		paramerterizedMethod.matchDuplicatemethods(ast1);
  })
  it('paramerterized a couple of duplicate methods - FunctionDeclaration', function() {
		var flag = false;
		estraverse.traverse(ast1, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' && node.id.type =='Identifier' && (node.id.name == 'fivePointAdd' || node.id.name == 'tenPointAdd')){
					flag = true;
				}		
			}
		});
		expect (flag).to.equal(false);
  })
})

describe('parameterizeMethod', function() {
	var ast2 = esprima.parse(code2);
  beforeEach(function() {
		paramerterizedMethod.searchParameterizeMethods(ast2);
		paramerterizedMethod.matchDuplicatemethods(ast2);
  })
  it('paramerterized a couple of duplicate methods - FunctionExpression', function() {
		var flag = false;
		estraverse.traverse(ast2, {
			enter : function (node, parent) {
				if(node.type =='FunctionExpression' && parent.id.type =='Identifier' && (parent.id.name == 'fivePointAdd' || parent.id.name == 'tenPointAdd')){
					flag = true;
				}		
			}
		});
		expect (flag).to.equal(false);
  })
})

describe('parameterizeMethod', function() {
	var ast3 = esprima.parse(code3);
	var count = 0;
  beforeEach(function() {
		paramerterizedMethod.searchParameterizeMethods(ast3);
		paramerterizedMethod.matchDuplicatemethods(ast3);
  })
  it('paramerterized a couple of duplicate methods - FunctionDeclaration , FunctionExpression', function() {
		var flag = false;
		estraverse.traverse(ast3, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' || node.type == 'FunctionExpression'){
					count++;
				}		
			}
		});
		expect (count).to.equal(1);
  })
})

describe('parameterizeMethod', function() {
	var ast4 = esprima.parse(code4);
	var count = 0;
  beforeEach(function() {
		paramerterizedMethod.searchParameterizeMethods(ast4);
		paramerterizedMethod.matchDuplicatemethods(ast4);
  })
  it('paramerterized a couple of duplicate methods - FunctionExpression , FunctionDeclaration', function() {
		var flag = false;
		estraverse.traverse(ast4, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' || node.type == 'FunctionExpression'){
					count++;
				}		
			}
		});
		expect (count).to.equal(1);
  })
})

describe('parameterizeMethod', function() {
	var ast5 = esprima.parse(code5);
	var count = 0;
  beforeEach(function() {
		paramerterizedMethod.searchParameterizeMethods(ast5);
		paramerterizedMethod.matchDuplicatemethods(ast5);
  })
  it('try to paramerterized dissimilar methods', function() {
		var flag = false;
		estraverse.traverse(ast5, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' || node.type == 'FunctionExpression'){
					count++;
				}		
			}
		});
		expect (count).to.equal(2);
  })
})

describe('parameterizeMethod', function() {
	var ast6 = esprima.parse(code6);
	var count = 0;
  beforeEach(function() {
		paramerterizedMethod.searchParameterizeMethods(ast6);
		paramerterizedMethod.matchDuplicatemethods(ast6);
  })
  it('try to paramerterized dissimilar methods', function() {
		var flag = false;
		estraverse.traverse(ast6, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' || node.type == 'FunctionExpression'){
					count++;
				}		
			}
		});
		expect (count).to.equal(2);
  })
})

/* describe('parameterizeMethod', function() {
	var ast7 = esprima.parse(code7);
  beforeEach(function() {
		paramerterizedMethod.searchParameterizeMethods(ast7);
		paramerterizedMethod.matchDuplicatemethods(ast7);
  })
  it('check ability to paramerterize similar methods with others', function() {
		var flag = false;
		estraverse.traverse(ast7, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' && node.id.name == 'tenPointAdd'){
					flag = true;
				}		
			}
		});
		expect (flag).to.equal(false);
  })
}) */