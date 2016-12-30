var expect = require('chai').expect;
var esprima = require('esprima');
var estraverse = require('estraverse');

var refactModule = require('../test3.js');

var code1 = 'function getFees(){} function getSeasonalDiscount(){}  function discountedPrice(arg1,arg2,arg3){} var fees = getFees(); var basePrice = quantity * itemPrice; var seasonDiscount = getSeasonalDiscount(); var finalPrice = discountedPrice(basePrice,seasonDiscount,fees);';
var code2 = 'function getPrice(itemName){} var item = "bottle"; getPrice(item);';
var code3 = 'function getTotal(amount,increment){} function getAmount(){var amount = 1000;} var amount = getAmount(); var total = getTotal(amount,0.1); ';

describe('Replace parameter with method call', function() {
	var ast1 = esprima.parse(code1);
	var count = 0;
  beforeEach(function() {
		refactModule.refacController(ast1);
  })
  it('check whether parameters are relpaced by a function call', function() {
		var flag = false;
		estraverse.traverse(ast1, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' && node.id.name == 'discountedPrice'){
					if(node.params.length == 1){
						flag = true;
					}
					
				}		
			}
		});
		expect (flag).to.equal(true);
  })
})

describe('Replace parameter with method call', function() {
	var ast2 = esprima.parse(code2);
	var count = 0;
  beforeEach(function() {
		refactModule.refacController(ast2);
  })
  it('check whether parameters are relpaced by a function call', function() {
		var flag = false;
		estraverse.traverse(ast2, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' && node.id.name == 'getPrice'){
					if(node.params.length == 1){
						flag = true;
					}
					
				}		
			}
		});
		expect (flag).to.equal(true);
  })
})

describe('Replace parameter with method call', function() {
	var ast3 = esprima.parse(code3);
	var count = 0;
  beforeEach(function() {
		refactModule.refacController(ast3);
  })
  it('check whether parameters are relpaced by a function call', function() {
		var flag = false;
		estraverse.traverse(ast3, {
			enter : function (node, parent) {
				if(node.type =='FunctionDeclaration' && node.id.name == 'getTotal'){
					if(node.params.length == 1){
						flag = true;
					}
					
				}		
			}
		});
		expect (flag).to.equal(true);
  })
})
