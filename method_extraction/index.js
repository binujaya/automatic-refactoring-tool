var estraverse = require('estraverse');

var MethodExtraction = function (ast) {
  estraverse.traverse(ast, {
    enter : function (node, parent) {
      //dummy code inplace of method extraction implementation
      if(node.type=='Identifier' && node.name=='answer'){
        node.name = 'x';
      }
    }
  });
}

module.exports = MethodExtraction;
