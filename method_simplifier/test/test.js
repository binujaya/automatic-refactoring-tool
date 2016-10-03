var expect = require('chai').expect;
var esprima = require('esprima');

var removeParameter = require('../removeParameter.js');

var sampleCode1 = "function sumation(x,y,z){var result = x+y;}";

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

// describe('removeParameter', function() {
// 	var flag = false;
//   beforeEach(function() {
//     ast = esprima.parse(sampleCode1);
//     flag = removeParameter.removeParameter(ast.body,"sumation",ast);
//   })
//   it('should return true', function() {
//     expect (flag).to.equal(true);
//   })
// })
