var nameGenerator = {
  count: 0,
  module: {
    comp: 'COMP',
    cond: 'COND',
    simp: 'SIMP'
  },
  genericName: function(moduleName) {
    this.count++;
    return 'name' + this.module[moduleName] + this.count;
  }
};

var varGenerator = {
  // NOTE: declareVar is not used
  declareVar : function (varName) {
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
  initializeVarToVar : function(varName1, varName2) {
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
  initializeVarToBlock : function (varName, block) {
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
  newInstance : function (varName) {
    return JSON.parse(`{
        "type": "Identifier",
        "name": "${varName}"
    }`);
  }
};

module.exports = {
  nameGenerator: nameGenerator,
  varGenerator: varGenerator
};
