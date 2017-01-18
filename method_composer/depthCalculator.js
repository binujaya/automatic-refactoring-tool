var estraverse = require('estraverse');

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
      if (!parent) {
        node.depthLevel = 0;
      }
      else if (isTrivialNode(node)) {
        node.depthLevel = parent.depthLevel;
      }
      else {
        node.depthLevel = parent.depthLevel + 1;
      }
    },
    leave: function (node, parent) {
      if (node.maxSubtreeDepth===undefined) {
        node.maxSubtreeDepth = 0;
      }
      if (parent && parent.maxSubtreeDepth===undefined) {
        parent.maxSubtreeDepth = 0;
      }
      if (parent && parent.maxSubtreeDepth < node.maxSubtreeDepth+1) {
        if (isTrivialNode(node)) {
          parent.maxSubtreeDepth = node.maxSubtreeDepth;
        }
        else {
          parent.maxSubtreeDepth = node.maxSubtreeDepth+1;
        }
      }
    }
  });
};

module.exports = {
  'addDepthToNodes': addDepthToNodes
};
