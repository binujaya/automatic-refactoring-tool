var scopeChain = {
  chain: [],
  blocks: [],
  push: function(node) {
    this.chain.push(node);
    if (node.type == 'BlockStatement') {
      this.blocks.push(node);
    }
  },
  pop: function() {
    var node = this.chain.pop();
    if (node.type == 'BlockStatement') {
      this.blocks.pop();
    }
  },
  find: function(nodeType) {
    return this.chain.find(function(node) {
      return node.type == nodeType;
    });
  },
  getCurrentBlock: function() {
    // TODO: return program.body if no block exists
    return this.blocks[this.blocks.length - 1].body;
  },
  getParentBlock: function() {
    return this.blocks[this.blocks.length - 2].body;
  },
  getGrandParentNode: function() {
    return this.chain[this.chain.length - 3];
  },
  print: function() {
    console.log(this.chain.map(node => node.type).join(' => '));
  }
};

module.exports = {
  scopeChain: scopeChain
};
