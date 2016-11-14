var expect = require('chai').expect;
var jsdiff = require('diff');

var compareExpression = require('../compareExpression.js');

var comparator1 = "{total = total + 24}";
var comparison1 = "{total = total + 14}";
var comparator2 = "{total = total + 24}";
var comparison2 = "{total = total * 4}";
var comparator3 = "{total = total + unitPrice}";
var comparison3 = "{total = total + unitPrice}";

describe('checkDifference', function() {
	var flag = false;
  beforeEach(function() {
    compareExpression.checkDifference(comparator1,comparison1);
	flag = compareExpression.compare();
  })
  it('check simillarity between two expressions with same operator', function() {
    expect (flag).to.equal(true);
  })
})

describe('checkDifference', function() {
	var flag = false;
  beforeEach(function() {
    compareExpression.checkDifference(comparator2,comparison2);
	flag = compareExpression.compare();
  })
  it('check simillarity between two expressions with different operators', function() {
    expect (flag).to.equal(false);
  })
})

describe('checkDifference', function() {
	var flag = false;
  beforeEach(function() {
    compareExpression.checkDifference(comparator3,comparison3);
	flag = compareExpression.compare();
  })
  it('check simillarity between two expressions with parameters', function() {
    expect (flag).to.equal(false);
  })
})