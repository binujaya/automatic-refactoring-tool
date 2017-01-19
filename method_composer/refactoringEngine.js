var estraverse = require('estraverse');
var scopeTracker = require('./scopeTracker.js').scopeTracker;
var nodeGenerator = require('./nodeGenerator.js');
var nameGenerator = nodeGenerator.nameGenerator;
var varGenerator = nodeGenerator.varGenerator;
var methodGenerator = nodeGenerator.methodGenerator;

//---------------------------------Parameter Assignment Fixer---------------------------------

var renameOccurence = function(ast, varName, newName) {
  estraverse.traverse(ast, {
    enter: function(node, parent) {
      if (node.name==varName) {
        node.name=newName;
      }
    }
  });
};

var removeAssignToParam = function(ast) {
  var funcParams = [];
  var paramCount = [];
  estraverse.traverse(ast, {
    enter: function(node, parent) {
      scopeTracker.push(node);
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
        var findFor = scopeTracker.find('ForStatement');
        var findWhile = scopeTracker.find('WhileStatement');
        var findForIn = scopeTracker.find('ForInStatement');
        var findForOf = scopeTracker.find('ForOfStatement');
        var findDoWhile = scopeTracker.find('DoWhileStatement');
        var loopNode = findFor || findWhile || findForIn || findForOf || findDoWhile;
        var ifNode = scopeTracker.find('IfStatement');
        var oldName, newName, newVar, parentIndex, newVarIndex;

        if (loopNode===undefined && (paramInAssignment || paramInUpdate)) {
          oldName = node.left ? node.left.name : node.argument.name;
          newName = nameGenerator.genericName();
          newVar = varGenerator.initializeVarToVar(newName, oldName);
          if (ifNode) {
            scopeTracker.getParentBlock().splice(0,0,newVar);
            newVarIndex=0;
            for (var i = newVarIndex+1; i<scopeTracker.getParentBlock().length; i++) {
              renameOccurence(scopeTracker.getParentBlock()[i],oldName,newName);
            }
          }
          else {
            parentIndex = scopeTracker.getCurrentBlock().indexOf(parent);
            scopeTracker.getCurrentBlock().splice(parentIndex,0,newVar);
            newVarIndex = parentIndex;
            for (var ii = newVarIndex+1; ii<scopeTracker.getCurrentBlock().length; ii++) {
              renameOccurence(scopeTracker.getCurrentBlock()[ii],oldName,newName);
            }
          }

        }

        if (loopNode && (paramInAssignment || paramInUpdate)) {
          oldName = node.left ? node.left.name : node.argument.name;
          newName = nameGenerator.genericName();
          newVar = varGenerator.initializeVarToVar(newName, oldName);
          parentIndex = scopeTracker.getParentBlock().indexOf(loopNode);
          scopeTracker.getParentBlock().splice(parentIndex,0,newVar);
          newVarIndex = parentIndex;
          for (var j = newVarIndex+1; j<scopeTracker.getParentBlock().length; j++) {
            renameOccurence(scopeTracker.getParentBlock()[j],oldName,newName);
          }
        }
      }
    },

    leave: function(node, parent) {
      scopeTracker.pop();
      if (node.type == 'FunctionExpression' && node.params.length != 0) {
        funcParams.splice(paramCount.pop());
      }
    }
  });
};

//---------------------------------Inline Method Generator---------------------------------

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
      if (node.type=='VariableDeclaration' && node.declarations[0].init!=null && node.declarations[0].id.name==methodName) {
        if (node.declarations[0].init.type=='FunctionExpression') {
          this.remove();
        }
      }
    }
  });
};

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
      scopeTracker.push(node);
      if (node.type=='FunctionExpression' && node.body.body.length==1) {
        console.log(node.body);
        var methodBody = node.body.body[0].argument;
        var methodName = parent.id.name;
        replaceCalleeWithMethodBody(ast, methodName, methodBody);
        // var methodDefinition = scopeTracker.chain.filter(isMethodDefinitionOf(methodName)).pop();
        deleteMethodDefinition(ast, methodName);
      }
    },
    leave: function (node, parent) {
      scopeTracker.pop();
    }
  });
};

//---------------------------------Variable Extractor---------------------------------

var extractVariables = function (ast) {
  estraverse.replace(ast, {
    enter: function (node, parent) {
      scopeTracker.push(node);
      if (scopeTracker.find('IfStatement') && parent.type=='LogicalExpression') {
        if (node.type != 'LogicalExpression' && node.maxSubtreeDepth > 1) {
          var newName = nameGenerator.genericName();
          var newVarInitialization = varGenerator.initializeVarToBlock(newName, JSON.stringify(node, null, 4));
          var newVarInstance = varGenerator.newInstance(newName);
          scopeTracker.getCurrentBlock().splice(0,0,newVarInitialization);
          return newVarInstance;
        }
      }
    },
    leave: function (node, parent) {
      scopeTracker.pop();
      if (parent.type=='BinaryExpression' && node.maxSubtreeDepth > 1) {
        var newName = nameGenerator.genericName();
        var newVarInitialization = varGenerator.initializeVarToBlock(newName, JSON.stringify(node, null, 4));
        var newVarInstance = varGenerator.newInstance(newName);
        scopeTracker.getCurrentBlock().splice(0,0,newVarInitialization);
        return newVarInstance;
      }
    }
  });
};

//---------------------------------Method Extractor---------------------------------

var getIdentifierNamesOfSubtree = function(ast) {
  var identifiers = [];
  estraverse.traverse(ast, {
    enter: function(node, parent) {
      if (node.name) {
        identifiers.push(node.name);
      }
    }
  });
  return identifiers.sort();
};

var areDependentLines = function (identifierSet1, identifierSet2) {
  for (var i = 0; i < identifierSet1.length; i++) {
    for (var j = 0; j < identifierSet2.length; j++) {
      if (identifierSet1[i] == identifierSet2[j]) {
        return true;
      }
    }
  }
  return false;
};

var getDependentLinesFromIdentifiers = function (identifiers) {
  var numOfLines = identifiers.length;
  var dependentLines = {};
  for (var i = 0; i < numOfLines-1; i++) {
    for (var j = i+1; j < numOfLines; j++) {
      if (areDependentLines(identifiers[i],identifiers[j])) {
        if (!dependentLines.hasOwnProperty(i)) {
          dependentLines[i] = [];
        }
        dependentLines[i].push(j);
      }
    }
  }
  return dependentLines;
};

var extractMethods = function (ast) {
  estraverse.traverse(ast, {
    enter: function (node, parent) {
      scopeTracker.push(node);
      if (node.type=='FunctionExpression' && node.body.body.length>3) {
        var identifiers = [];
        var numOfLines = node.body.body.length;
        for (var line of node.body.body) {
          var identifiersInLine = getIdentifierNamesOfSubtree(line);
          identifiers.push(identifiersInLine);
        }
        var dependentLines = getDependentLinesFromIdentifiers(identifiers);
        console.log(dependentLines);
        for (var block in dependentLines) {
          // TODO: Move block. NOT ReturnStatement
          if (dependentLines[block].length > 1) {
            var newMethodBody = [];
            newMethodBody.push(node.body.body[block]);
            for (var item of dependentLines[block]) {
              newMethodBody.push(node.body.body[item]);
            }
            var newMethodName = nameGenerator.genericName();
            var newMethod = methodGenerator.nonReturnMethod(newMethodName, JSON.stringify(newMethodBody, null, 4));
            scopeTracker.getCurrentBlock().splice(0,0,newMethod);
          }
        }
      }
    },
    leave: function (node, parent) {
      scopeTracker.pop();
    }
  });
};

module.exports = {
  renameOccurence: renameOccurence,
  removeAssignToParam: removeAssignToParam,
  addInlineMethods: addInlineMethods,
  extractVariables: extractVariables,
  extractMethods: extractMethods
};
