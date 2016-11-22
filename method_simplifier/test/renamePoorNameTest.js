var expect = require('chai').expect;
var esprima = require('esprima');
var estraverse = require('estraverse');

var methodRename = require('../renamePoorName.js');

var code1 = "function getTotal(){}";
var code2 = "var reset = function(){};";
var code3 = "function get_Mul(){} get_Mul();";
var code4 = 'var cal_salary = function(){}; cal_salary()';
var code5 = "function getQunDetails(){} getQunDetails(); var sal_incre = function(){}; sal_incre()";
var code6 = "function gettot(){} gettot();";


describe('rename poor methods names', function() {
	var ast1 = esprima.parse(code1);
  beforeEach(function() {
	methodRename.searchMethodsName(ast1);	
  })
  it('Identify meaningful names - FunctionDeclaration', function() {
		var flag = false;
		estraverse.traverse(ast1, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' && node.id.name == 'getTotal' ){
					flag = true;
				}
			}
		});
		expect (flag).to.equal(true);
  })
})

describe('rename poor methods names', function() {
	var ast2 = esprima.parse(code2);
  beforeEach(function() {
	methodRename.searchMethodsName(ast2);	
  })
  it('Identiy meaningful names - FunctionExpression', function() {
		var flag = false;
		estraverse.traverse(ast2, {
			enter : function (node, parent) {
				if(node.type == 'FunctionExpression' && parent.id.type == 'Identifier' && parent.id.name == 'reset'){
					flag = true;
				}
			}
		});
		expect (flag).to.equal(true);
  })
})

describe('rename poor methods names', function() {
	var ast3 = esprima.parse(code3);
  beforeEach(function() {
	methodRename.searchMethodsName(ast3);	
  })
  it('Rename poor method name: FunctionDeclaration', function() {
		var flag = false;
		estraverse.traverse(ast3, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' && node.id.name == 'get_Mul'){
					flag = true;
				}
			}
		});
		expect (flag).to.equal(false);
  })
})

describe('rename poor methods names', function() {
	var ast4 = esprima.parse(code4);
  beforeEach(function() {
	methodRename.searchMethodsName(ast4);	
  })
  it('Rename poor method name: FunctionExpression', function() {
		var flag = false;
		estraverse.traverse(ast4, {
			enter : function (node, parent) {
				if(node.type == 'FunctionExpression' && parent.id.type == 'Identifier' && parent.id.name == 'cal_salary'){
					flag = true;
				}
			}
		});
		expect (flag).to.equal(false);
  })
})

describe('rename poor methods names', function() {
	var ast5 = esprima.parse(code5);
  beforeEach(function() {
	methodRename.searchMethodsName(ast5);	
  })
  it('Rename poor method names at once', function() {
		var flag = false;
		estraverse.traverse(ast5, {
			enter : function (node, parent) {
				if(node.type == 'FunctionExpression' && parent.id.type == 'Identifier' && parent.id.name == 'sal_incre'){
					flag = true;
				}
			}
		});
		expect (flag).to.equal(false);
  })
})

describe('rename poor methods names', function() {
	var ast6 = esprima.parse(code6);
  beforeEach(function() {
	methodRename.searchMethodsName(ast6);	
  })
  it('Rename bad method naming conventions', function() {
		var flag = false;
		estraverse.traverse(ast6, {
			enter : function (node, parent) {
				if(node.type == 'FunctionExpression' && node.id.name == 'gettot'){
					flag = true;
				}
			}
		});
		expect (flag).to.equal(false);
  })
})