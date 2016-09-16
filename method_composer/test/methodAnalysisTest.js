var expect = require('chai').expect;
var esprima = require('esprima');

var MethodExtraction = require('../index.js');

var sampleCode1 = "var x = 55;";
var sampleCode2 = "var x = 45; var y = 44; var myFunc = function(x1, y1) { var z1; x1++; y1++; y1 = y1 * 2; z1 = x1 + y1; return z1; } var z = myFunc(x, y); console.log(z);";

describe('addDepthToNodes', function() {
  beforeEach(function() {
    ast = esprima.parse(sampleCode1);
    MethodExtraction.addDepthToNodes(ast);
  })
  it('should assign depth to each node', function() {
    expect(ast.depth).to.equal(0);
    expect(ast.body[0].depth).to.equal(1);
  })
})
