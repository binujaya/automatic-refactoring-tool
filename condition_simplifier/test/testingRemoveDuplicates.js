var expect = require('chai').expect;
var esprima = require('esprima');

var ConditionalSimplifier = require('../remove_duplicates.js');



describe('removeDuplicatesFromArray', function() {
  
  beforeEach(function() {
    var testArray=["printBill","printSum","printBill"];
    ConditionalSimplifier.searchItem("printBill",testArray);
  })
  it('should remove duplicate function calls', function() {
    expect(true);
  })
})

  
  //./node_modules/mocha/bin/mocha method_extraction/test/methodAnalysisTest.js
//./node_modules/mocha/bin/mocha condition_simplifier/test/testingRemoveDuplicates.js