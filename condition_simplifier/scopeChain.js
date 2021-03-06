var scopeChain = {
    chain: [],
    blocks: [],
    push: function (node) {
        this.chain.push(node);
        if (node.type == 'BlockStatement') {
            this.blocks.push(node);
        }
    },
    pop: function () {
        var node = this.chain.pop();
        if (node.type == 'BlockStatement') {
            this.blocks.pop();
        }
    },
    find: function (nodeType) {
        return this.chain.find(function (node) {
            return node.type == nodeType;
        });
    },
    getNode: function (nodeType) {
        for (var i = 0; i < this.chain.length; i++) {
            if (this.chain[i].type === nodeType) {
                return this.chain[i];
            }
        }
    },
    getParentNode: function (nodeType) {
        for (var i = 1; i < this.chain.length; i++) {
            if (this.chain[i].type === nodeType) {
                return this.chain[i-1];
            }
        }
    },
    getCurrentBlock: function () {
        return this.blocks[this.blocks.length - 1].body;
    },
    getParentBlock: function () {
        return this.blocks[this.blocks.length - 2].body;
    },
    getGrandParentNode: function () {
        return this.chain[this.chain.length - 3];
    },
    print: function () {
        console.log(this.chain.map(node => node.type).join(' => '));
    }
};

module.exports = {
    scopeChain: scopeChain
};