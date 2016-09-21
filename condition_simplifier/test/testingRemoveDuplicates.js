var expect = require('chai').expect;
var esprima = require('esprima');
var escodegen= require('escodegen');

var ConditionalSimplifier = require('../remove_duplicates.js');

var data = "var discount = true;var amount;if(discount){ amount = price * 0.9;printBill();}else{amount=price;printBill();}";

 describe('remove duplicates', function () {
    before(function () {
      var ast = esprima.parse(data);
      var modifiedAst=ConditionalSimplifier.removeDuplicates(ast);
      var code = escodegen.generate(modifiedAst);
    });
    it('should remove duplicate function calls', function () {
      
        
        
expect(code.replace(/(\r\n|\n|\r)/gm,"").replace(/ /g,'')).to.equal("var discount = true;\nvar amount;\nif (discount)  {\n   amount = price * 0.9;\n} else {\n     amount = price;\n}\n".replace(/(\r\n|\n|\r)/gm,"").replace(/ /g,'')); 
    })
  })

  
  
//./node_modules/mocha/bin/mocha condition_simplifier/test/testingRemoveDuplicates.js