var estraverse = require('estraverse');
var scopeChain = require('./scopeChain.js').scopeChain;
var util = require('./util.js');
var nameGenerator = util.nameGenerator;
var varGenerator = util.varGenerator;


var renameOccurence = function(ast, varName, newName) {
  estraverse.traverse(ast, {
    enter: function(node, parent) {
      if (node.name==varName) {
        node.name=newName;
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
      // NOTE: maxSubtreeDepth does not cater well for broad yet shallow subtrees
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

var removeAssignToParam = function(ast) {
  var funcParams = [];
  var paramCount = [];
  estraverse.traverse(ast, {
    enter: function(node, parent) {
      scopeChain.push(node);
      if (node.type == 'FunctionExpression' && node.params.length != 0) {
        var count = 0;
        funcParams = funcParams.concat(node.params.map(function(param) {
          count++;
          return param.name;
        }));
        paramCount.push(count);
      }
      if (funcParams.length != 0) {
        var paramInAssignment = (node.type == 'AssignmentExpression' && funcParams.indexOf(node.left.name)!=-1);
        var paramInUpdate = (node.type =='UpdateExpression' && funcParams.indexOf(node.argument.name)!=-1);
        var findFor = scopeChain.find('ForStatement');
        var findWhile = scopeChain.find('WhileStatement');
        var findForIn = scopeChain.find('ForInStatement');
        var findForOf = scopeChain.find('ForOfStatement');
        var findDoWhile = scopeChain.find('DoWhileStatement');
        var loopNode = findFor || findWhile || findForIn || findForOf || findDoWhile;
        var oldName, newName, newVar, parentIndex, newVarIndex;

        if (loopNode===undefined && (paramInAssignment || paramInUpdate)) {
          oldName = node.left ? node.left.name : node.argument.name;
          newName = nameGenerator.genericName('comp');
          newVar = varGenerator.initializeVarToVar(newName, oldName);
          parentIndex = scopeChain.getCurrentBlock().indexOf(parent);
          scopeChain.getCurrentBlock().splice(parentIndex,0,newVar);
          newVarIndex = parentIndex;
          for (var i = newVarIndex+1; i<scopeChain.getCurrentBlock().length; i++) {
            renameOccurence(scopeChain.getCurrentBlock()[i],oldName,newName);
          }
        }

        if (loopNode && (paramInAssignment || paramInUpdate)) {
          oldName = node.left ? node.left.name : node.argument.name;
          newName = nameGenerator.genericName('comp');
          newVar = varGenerator.initializeVarToVar(newName, oldName);
          parentIndex = scopeChain.getParentBlock().indexOf(loopNode);
          scopeChain.getParentBlock().splice(parentIndex,0,newVar);
          newVarIndex = parentIndex;
          for (var j = newVarIndex+1; j<scopeChain.getParentBlock().length; j++) {
            renameOccurence(scopeChain.getParentBlock()[j],oldName,newName);
          }
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

var replaceCalleeWithMethodBody = function (ast, calleeName, methodBody) {
  estraverse.replace(ast, {
    enter: function (node, parent) {
      if (node.type=='CallExpression' && node.callee.name==calleeName) {
        return methodBody;
      }
    }
  });
};

var deleteMethodDefinition = function (ast, methodName) {
  estraverse.replace(ast, {
    enter: function (node, parent) {
      if (node.type=='VariableDeclaration' && node.declarations[0].init.type=='FunctionExpression' && node.declarations[0].id.name==methodName) {
        this.remove();
      }
    }
  });
};

// NOTE: This is not used. May be used when selecting method definitions from scope chain
var isMethodDefinitionOf = function (methodName) {
  return function (node) {
    if (node.type=='VariableDeclaration' && node.declarations[0].init.type=='FunctionExpression' && node.declarations[0].id.name==methodName) {
      return true;
    }
  };
};


var addInlineMethods = function (ast) {
  estraverse.traverse(ast, {
    enter: function (node, parent) {
      scopeChain.push(node);
      if (node.type=='FunctionExpression' && node.body.body.length==1) {
        var methodBody = node.body.body[0].argument;
        var methodName = parent.id.name;
        replaceCalleeWithMethodBody(ast, methodName, methodBody);
        // var methodDefinition = scopeChain.chain.filter(isMethodDefinitionOf(methodName)).pop();
        deleteMethodDefinition(ast, methodName);
      }
    },
    leave: function (node, parent) {
      scopeChain.pop();
    }
  });
};


var extractVariables = function (ast) {
  estraverse.replace(ast, {
    enter: function (node, parent) {
      scopeChain.push(node);
      if (scopeChain.find('IfStatement') && parent.type=='LogicalExpression') {
        if (node.type != 'LogicalExpression' && node.maxSubtreeDepth > 1) {
          var newName = nameGenerator.genericName('comp');
          var newVarInitialization = varGenerator.initializeVarToBlock(newName, JSON.stringify(node, null, 4));
          var newVarInstance = varGenerator.newInstance(newName);
          scopeChain.getCurrentBlock().splice(0,0,newVarInitialization);
          return newVarInstance;
        }
      }
    },
    leave: function (node, parent) {
      scopeChain.pop();
    }
  });
};



module.exports = {
  renameOccurence: renameOccurence,
  addDepthToNodes: addDepthToNodes,
  removeAssignToParam: removeAssignToParam,
  addInlineMethods: addInlineMethods,
  extractVariables: extractVariables
};
