var estraverse = require('estraverse');

var scopeChain = {
  chain: [],
  push: function(node) {
    this.chain.push(node);
  },
  pop: function() {
    this.chain.pop();
  },
  print: function() {
    console.log(this.chain.map(node => node.type).join(' => '));
  }
};

var nameGenerator = {
  count: 0,
  module: {
    comp: 'COMP',
    cond: 'COND',
    simp: 'SIMP'
  },
  genericName: function (moduleName) {
    this.count++;
    return 'name'+this.module[moduleName]+this.count;
  }
};

var renameMethod = function(ast, methodName, newName) {
  estraverse.traverse(ast, {
    enter: function(node, parent) {
      if (node.type == 'FunctionExpression' && parent.type == 'VariableDeclarator' && parent.id.name == methodName) {
        parent.id.name = newName;
      }
    }
  });
};
var printNode = function(nodeType, ast) {
  estraverse.traverse(ast, {
    enter: function(node) {
      if (node.type == nodeType) {
        console.log(node);
      }
    }
  });
};

var trivialNodes = {
  BlockStatement: 'BlockStatement',
  VariableDeclarator: 'VariableDeclarator'
};

var isTrivialNode = function(node) {
  return Object.keys(trivialNodes).some(function(key) {
    return key == node.type;
  });
};

var addDepthToNodes = function(ast) {
  estraverse.traverse(ast, {
    enter: function(node, parent) {
      if (!parent) node.depth = 0;
      else if (isTrivialNode(node)) node.depth = parent.depth;
      else node.depth = parent.depth + 1;
    }
  });
};

var removeAssignToParam = function(ast) {
  var funcParams = [];
  var paramCount = [];
  estraverse.traverse(ast, {
    enter: function(node, parent) {
      scopeChain.push(node);
      if (node.type == 'FunctionExpression' && node.params.length != 0) {
        var count = 0;
        funcParams = node.params.map(function(param) {
          count++;
          return param.name;
        });
        paramCount.push(count);
      }
      if (funcParams.length != 0) {
        if (node.type == 'AssignmentExpression' && funcParams.indexOf(node.left.name)!=-1) {
          // TODO: rename future occurences
          console.log('node left:',node.left);
          console.log('node:',node.type);
          console.log('parent:',parent.type);
        }
      }
    },
    leave: function(node, parent) {
      scopeChain.pop();
      if (node.type == 'FunctionExpression' && node.params.length != 0) {
        funcParams.splice(paramCount.pop());
      }
    }
  });
};



module.exports = {
  renameMethod: renameMethod,
  addDepthToNodes: addDepthToNodes,
  printNode: printNode,
  removeAssignToParam: removeAssignToParam
};
