var expect = require('chai').expect;
var esprima = require('esprima');

var MethodExtraction = require('../index.js');

describe('addDepthToNodes', function () {
  beforeEach(function () {
    ast = esprima.parse("var x = 55;");
    MethodExtraction.addDepthToNodes(ast);
  })
  it('should assign depth to each node', function () {
    expect(ast.depth).to.equal(0);
    expect(ast.body[0].depth).to.equal(1);
  })
})
