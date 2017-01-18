var nameGenerator = {
  count: 0,
  genericName: function(refactoring) {
    this.count++;
    return 'VAR_' + this.count;
  }
};

var varGenerator = {
  declareVar: function(varName) {
    return JSON.parse(`{
        "type": "VariableDeclaration",
        "declarations": [
            {
                "type": "VariableDeclarator",
                "id": {
                    "type": "Identifier",
                    "name": "${varName}"
                },
                "init": null
            }
        ],
        "kind": "var"
    }`);
  },
  initializeVarToVar: function(varName1, varName2) {
    return JSON.parse(`{
        "type": "VariableDeclaration",
        "declarations": [
            {
                "type": "VariableDeclarator",
                "id": {
                    "type": "Identifier",
                    "name": "${varName1}"
                },
                "init": {
                    "type": "Identifier",
                    "name": "${varName2}"
                }
            }
        ],
        "kind": "var"
    }`);
  },
  initializeVarToBlock: function(varName, block) {
    return JSON.parse(`{
        "type": "VariableDeclaration",
        "declarations": [
            {
                "type": "VariableDeclarator",
                "id": {
                    "type": "Identifier",
                    "name": "${varName}"
                },
                "init": ${block}
            }
        ],
        "kind": "var"
    }`);
  },
  newInstance: function(varName) {
    return JSON.parse(`{
        "type": "Identifier",
        "name": "${varName}"
    }`);
  }
};

var methodGenerator = {
  nonReturnMethod: function(methodName, body) {
    return JSON.parse(`{
        "type": "VariableDeclaration",
        "declarations": [
            {
                "type": "VariableDeclarator",
                "id": {
                    "type": "Identifier",
                    "name": "${methodName}"
                },
                "init": {
                    "type": "FunctionExpression",
                    "id": null,
                    "params": [],
                    "defaults": [],
                    "body": {
                        "type": "BlockStatement",
                        "body": ${body}
                    },
                    "generator": false,
                    "expression": false
                }
            }
        ],
        "kind": "var"
    }`);
  }
};

module.exports = {
  nameGenerator: nameGenerator,
  varGenerator: varGenerator,
  methodGenerator: methodGenerator
};
