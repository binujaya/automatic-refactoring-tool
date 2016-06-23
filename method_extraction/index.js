var estraverse = require('estraverse');
var escodegen = require('escodegen');

var MethodExtraction = function (ast) {
  estraverse.traverse(ast, {
    enter : function (node, parent) {
      if(node.type=='Identifier' && node.name=='answer'){      

        node.name = 'x';
        var refactoredCode = escodegen.generate(ast);

        console.log('\n\n REFACTORED CODE: \n');
        console.log(refactoredCode);    
      }
    }
  });
}

module.exports = MethodExtraction;
