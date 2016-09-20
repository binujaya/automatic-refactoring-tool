var expect = require('chai').expect;
var esprima = require('esprima');

var ConditionalSimplifier = require('../remove_duplicates.js');



describe('removeDuplicatesFromArray', function() {
  var testArray=["printBill","printSum","printBill"];
  beforeEach(function() {
    
    ConditionalSimplifier.removeDuplicates[testArray];
  })
  it('should remove duplicate function calls', function() {
    expect(testArray==["printBill"]);
  })
})
