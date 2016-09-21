var estraverse = require('estraverse');
var escodegen = require('escodegen');

var renameMethod = function (ast, methodName, newName) {
  estraverse.traverse(ast, {
    enter : function (node, parent) {
      if(node.type=='FunctionExpression' && parent.type=='VariableDeclarator' && parent.id.name==methodName){
        parent.id.name = newName;
      }
    }
  });
  var refactoredCode = escodegen.generate(ast);
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
}

var printNode = function (nodeType, ast) {
  estraverse.traverse(ast, {
    enter : function (node) {
      if (node.type==nodeType) {
        console.log(node);
      }
    }
  });
}

var removeAssignToParam = function (ast) {
  var parameters = [];
  estraverse.traverse(ast, {
    enter : function (node, parent) {
      if (node.type=='FunctionExpression') {
        parameters = node.params.map(function (param) {return param.name;});
        console.log('params',parameters);
        console.log(node);
      }
    }
  });
}



module.exports = {
  renameMethod: renameMethod,
  addDepthToNodes: addDepthToNodes,
  printNode: printNode,
  removeAssignToParam: removeAssignToParam
};
