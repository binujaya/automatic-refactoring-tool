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

var varGenerator = function(varName, value) {
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

module.exports = {
  nameGenerator: nameGenerator,
  varGenerator: varGenerator
};
