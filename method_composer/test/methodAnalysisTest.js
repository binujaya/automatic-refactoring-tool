var expect = require('chai').expect;
var esprima = require('esprima');
var escodegen = require('escodegen');

var MethodComposer = require('../index.js');

var sampleCode1 = "var x = 55;";
var sampleCode2 = "var x = 45; var y = 44; var myFunc = function(x1, y1) { var z1; x1++; y1++; y1 = y1 * 2; z1 = x1 + y1; return z1; } var z = myFunc(x, y); console.log(z);";

describe('MethodComposer', function () {
  describe('addDepthToNodes', function() {
    before(function() {
      ast = esprima.parse(sampleCode1);
      MethodComposer.addDepthToNodes(ast);
    })
    it('should assign depth to each node', function() {
      expect(ast.depth).to.equal(0);
      expect(ast.body[0].depth).to.equal(1);
    });
  });
  describe('renameMethod', function () {
    before(function () {
      MethodComposer.renameMethod(ast, 'myFunc', 'myFunc2');
    });
    it('should rename myFunc method to myFunc2', function () {
      //expect(escodegen.generate(ast)).to.equal("var x = 45; var y = 44; var myFunc2 = function(x1, y1) { var z1; x1++; y1++; y1 = y1 * 2; z1 = x1 + y1; return z1; } var z = myFunc(x, y); console.log(z);");
    })
  })
});
