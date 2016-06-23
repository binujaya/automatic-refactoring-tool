var estraverse = require('estraverse');
var escodegen = require('escodegen');

var testRefactor = function (ast, methodName) {
  estraverse.traverse(ast, {
    enter : function (node, parent) {
      if(node.type=='FunctionExpression' && parent.type=='VariableDeclarator' && parent.id.name==methodName){
        parent.id.name = 'x';
      }
    }
  });

  var refactoredCode = escodegen.generate(ast);
  console.log('\n\n REFACTORED CODE: \n');
  console.log(refactoredCode);
}

var trivialNodes = {
  BlockStatement : 'BlockStatement',
  VariableDeclarator : 'VariableDeclarator'
}

var isTrivialNode = function (node) { 
  return Object.keys(trivialNodes).some(function (key) {
    return key==node.type;
  });
}

var addDepthToNodes = function (ast) {
  estraverse.traverse(ast, {
    enter : function (node, parent) {
      if (!parent) node.depth = 0;
      else if (isTrivialNode(node)) node.depth = parent.depth;
      else node.depth = parent.depth + 1;
    }
  });
  console.log(JSON.stringify(ast, null, 4));    
}

module.exports = {
  testRefactor: testRefactor,
  addDepthToNodes: addDepthToNodes
};
