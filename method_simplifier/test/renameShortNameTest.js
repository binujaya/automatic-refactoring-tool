var expect = require('chai').expect;
var esprima = require('esprima');
var estraverse = require('estraverse');

var methodRename = require('../method_rename.js');

var code1 = "function get(){}";
var code2 = 'var sum = function(){}';
var code3 = "function get(){} get();";

describe('renameMethods', function() {
	var ast1 = esprima.parse(code1);
  beforeEach(function() {
	methodRename.searchMethodsName(ast1);	
  })
  it('Rename short method name: FunctionDeclaration', function() {
		var flag = false;
		estraverse.traverse(ast1, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' && node.id.type =='Identifier' && node.id.name == 'get' ){
					flag = true;
				}
			}
		});
		expect (flag).to.equal(false);
  })
})

describe('renameMethods', function() {
	var ast2 = esprima.parse(code2);
  beforeEach(function() {
	methodRename.searchMethodsName(ast2);	
  })
  it('Rename short method name: FunctionExpression', function() {
		var flag = false;
		estraverse.traverse(ast2, {
			enter : function (node, parent) {
				if(node.type == 'FunctionExpression' && parent.id.type == 'Identifier' && parent.id.name == 'sum'){
					flag = true;
				}
			}
		});
		expect (flag).to.equal(false);
  })
})

describe('renameMethods', function() {
	var ast3 = esprima.parse(code3);
  beforeEach(function() {
	methodRename.searchMethodsName(ast3);	
  })
  it('Rename short method name and replace callee places', function() {
		var flag = false;
		estraverse.traverse(ast3, {
			enter : function (node, parent) {
				if(node.type=='CallExpression' && node.callee.type== 'Identifier' && node.callee.name === 'get' ){
					flag = true;
				}
			}
		});
		expect (flag).to.equal(false);
  })
})
