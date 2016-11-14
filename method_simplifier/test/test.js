var expect = require('chai').expect;
var esprima = require('esprima');

var removeParameter = require('../removeParameter.js');

var sampleCode1 = "function sumation(x,y,z){var result = x+y;}";
var sampleCode2 = "var sumation = function(x,y,z){var result = x+y;}";
var sampleCode3 = "(function(x,y,z){var result = x+y;})();";
var sampleCode4 = "var z = 10; function sumation(x,y,z){var result = x+y;}";

describe('isContainedInMethodBody', function() {
	var count = 0;
  beforeEach(function() {
    ast = esprima.parse(sampleCode1);
    count = removeParameter.isContainedInMethodBody(ast.body[0],"z",ast);
  })
  it('count number of time the parameter use', function() {
    expect (count).to.equal(1);
  })
})

describe('isContainedInMethodBody', function() {
	var count = 0;
  beforeEach(function() {
    ast = esprima.parse(sampleCode2);
    count = removeParameter.isContainedInMethodBody(ast.body[0].declarations[0].init,"z",ast);
  })
  it('count number of time the parameter use', function() {
    expect (count).to.equal(1);
  })
})

describe('isContainedInMethodBody', function() {
	var count = 0;
  beforeEach(function() {
    ast = esprima.parse(sampleCode3);
    count = removeParameter.isContainedInMethodBody(ast.body[0].expression.callee,"z",ast);
  })
  it('count number of time the parameter use', function() {
    expect (count).to.equal(1);
  })
})

describe('isContainedInMethodBody', function() {
	var count = 0;
  beforeEach(function() {
    ast = esprima.parse(sampleCode4);
    count = removeParameter.isContainedInMethodBody(ast.body[1],"z",ast);
  })
  it('count number of time the parameter use', function() {
    expect (count).to.equal(1);
  })
})


describe('removeParameter', function() {
	 var count = 0;
   beforeEach(function() {
     ast = esprima.parse(sampleCode1);
     removeParameter.removeParameter(ast.body[0],"z",ast);
	 count = removeParameter.isContainedInMethodBody(ast.body[0],"z",ast);
   })
   it('count should be zero', function() { 
     expect (count).to.equal(0);
   })
 })
