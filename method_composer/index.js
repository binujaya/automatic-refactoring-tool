var estraverse = require('estraverse');

var scopeChain = {
  chain: [],
  blocks: [],
  push: function(node) {
    this.chain.push(node);
    if (node.type=='BlockStatement') {
      this.blocks.push(node);
    }
  },
  pop: function() {
    var node = this.chain.pop();
    if (node.type=='BlockStatement') {
      this.blocks.pop();
    }
  },
  find: function (nodeType) {
    return this.chain.find(function (node) {
      return node.type==nodeType;
    });
  },
  getCurrentBlock: function () {
    return this.blocks[this.blocks.length-1].body;
  },
  getParentBlock: function () {
    return this.blocks[this.blocks.length-2].body
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

var varGenerator = function (varName, value) {
  return JSON.parse(`{
      "type": "VariableDeclaration",
      "declarations": [
          {
              "type": "VariableDeclarator",
              "id": {
                  "type": "Identifier",
                  "name": "${varName}"
              },
              "init": {
                  "type": "Identifier",
                  "name": "${value}"
              }
          }
      ],
      "kind": "var"
  }`);
};

var renameOccurence = function(ast, varName, newName) {
  estraverse.traverse(ast, {
    enter: function(node, parent) {
      if (node.name==varName) {
        node.name=newName;
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
        var paramInAssignment = (node.type == 'AssignmentExpression' && funcParams.indexOf(node.left.name)!=-1);
        var paramInUpdate = (node.type =='UpdateExpression' && funcParams.indexOf(node.argument.name)!=-1);
        var loopNode = scopeChain.find('ForStatement') || scopeChain.find('WhileStatement') || scopeChain.find('ForInStatement') || scopeChain.find('ForOfStatement') || scopeChain.find('DoWhileStatement');
        var oldName, newName, newVar, parentIndex, newVarIndex;
        if (loopNode===undefined && (paramInAssignment || paramInUpdate)) {
          oldName = node.left ? node.left.name : node.argument.name;
          newName = nameGenerator.genericName('comp');
          newVar = varGenerator(newName, oldName);
          parentIndex = scopeChain.getCurrentBlock().indexOf(parent);
          scopeChain.getCurrentBlock().splice(parentIndex,0,newVar);
          newVarIndex = parentIndex;
          for (var i = newVarIndex+1; i<scopeChain.getCurrentBlock().length; i++) {
            renameOccurence(scopeChain.getCurrentBlock()[i],oldName,newName);
          }
        }

        if (loopNode && (paramInAssignment || paramInUpdate)) {
          // TODO: add newVar to above for loop using previous BlockStatement tracking (pop)
          oldName = node.left ? node.left.name : node.argument.name;
          newName = nameGenerator.genericName('comp');
          newVar = varGenerator(newName, oldName);
          parentIndex = scopeChain.getParentBlock().indexOf(loopNode);
          scopeChain.getParentBlock().splice(parentIndex,0,newVar);
          newVarIndex = parentIndex;
          for (var i = newVarIndex+1; i<scopeChain.getParentBlock().length; i++) {
            renameOccurence(scopeChain.getParentBlock()[i],oldName,newName);
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



module.exports = {
  renameOccurence: renameOccurence,
  addDepthToNodes: addDepthToNodes,
  printNode: printNode,
  removeAssignToParam: removeAssignToParam
};
