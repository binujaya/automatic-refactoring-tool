var expect = require('chai').expect;
var esprima = require('esprima');
var estraverse = require('estraverse');

var paramerterizedMethod = require('../paramerterizedMethod.js');

var code1 = "function fivePointAdd(){ salary = salary + 5;} function tenPointAdd(){ salary = salary + 10;} ";
var code2 = "function fivePresentRise(){ salary *= 5;} function tenPointAdd(){ salary = salary + 10;} function tenPresentRise(){ salary *= 10;} function fivePointAdd(){ salary = salary + 5;}";
var code3 = "function fivePointAdd(){ salary = salary + 5;} function test(){alert('a');} function tenPointAdd(){ salary = salary + 10;} ";

describe('parameterizeMethod', function() {
	var ast1 = esprima.parse(code1);
  beforeEach(function() {
		paramerterizedMethod.searchParameterizeMethods(ast1);
		paramerterizedMethod.matchDuplicatemethods(ast1);
  })
  it('paramerterized a couple of duplicate methods', function() {
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
  it('check if able to paramerterized many couple of simillar methods at once', function() {
		var count = 0;
		estraverse.traverse(ast2, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' && node.id.type =='Identifier'){
					count++;
				}		
			}
		});
		expect (count).to.equal(2);
  })
})

describe('parameterizeMethod', function() {
	var ast3 = esprima.parse(code3);
  beforeEach(function() {
		paramerterizedMethod.searchParameterizeMethods(ast3);
		paramerterizedMethod.matchDuplicatemethods(ast3);
  })
  it('check if able to identify and paramerterized methods with others', function() {
		var flag = false;
		estraverse.traverse(ast3, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' && node.id.type =='Identifier' && (node.id.name == 'fivePointAdd' || node.id.name == 'tenPointAdd')){
					flag = true;
				}		
			}
		});
		expect (flag).to.equal(false);
  })
})