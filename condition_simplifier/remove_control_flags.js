var fs = require('fs');
var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');
var scopeChain = require('./scopeChain.js').scopeChain;



var findControlFlagVaraible = function (array) {
    for (var k = 0; k < array.length; k++) {
        var node = array[k].declarations[0];
        if (node.type === "VariableDeclarator" && (node.init.value === true || node.init.value === false)) {

            var valueObj = {
                key: node.id.name,
                test: node.init,
                value: node.init.value
            };
            return valueObj;
        }
    }
};

var replaceWithBreak = function (ast, newNode) {

    var breakNode = JSON.parse(`{
      "type": "BreakStatement",
      "label": null
 }`);
    estraverse.replace(ast, {
        enter: function (node, parent) {
            if (JSON.stringify(newNode) == JSON.stringify(node)) {
                return breakNode;
            }
        }
    });
};



var isAbleToReplaceWithBreak = function (ast) {
    estraverse.traverse(ast, {

        enter: function enter(node, parent) {
            scopeChain.push(node);
            var findWhile = scopeChain.find('WhileStatement');
            var findDoWhile = scopeChain.find('DoWhileStatement');//replace with break
            if (node.type === "AssignmentExpression" && (findWhile || findDoWhile)) {
                var position;

                if (scopeChain.getGrandParentNode().type === "BlockStatement") position = scopeChain.getCurrentBlock().indexOf(parent);
                else {
                    position = scopeChain.getCurrentBlock().indexOf(scopeChain.getGrandParentNode());
                }

                if (findWhile) {
                    var whileNode = scopeChain.getNode('WhileStatement');
                    if (whileNode.test !== undefined) {

                        if (node.left.name === whileNode.test.name) {
                            replaceWithBreak(scopeChain.getCurrentBlock()[position], node);
                        }
                    }
                }
                if (findDoWhile) {
                    var whileNode = scopeChain.getNode('DoWhileStatement');
                    if (whileNode.test !== undefined) {
                        if (node.left.name === whileNode.test.name) {
                            replaceWithBreak(scopeChain.getCurrentBlock()[position], node);

                        }
                    }
                }
            }

        },

        leave: function (node, parent) {
            scopeChain.pop();

        }
    });

};



var removeControlFlags = function (ast) {
    estraverse.traverse(ast, {

        enter: function enter(node, parent) {
            scopeChain.push(node);

        },

        leave: function (node, parent) {
            scopeChain.pop();

        }
    });

    return ast;
};

var removeFlagMain = function () {
    fs.readFile('../input/input_remove_control_flags.js', 'utf8', function (err, data) {
        //fs.readFile('./input/input_if_1.js', 'utf8', function (err, data) {   
        if (err) {
            throw err;
        }
        console.log("---------------------------------------------------------------------------");
        console.log("Before refactoring");
        console.log(data);
        var ast = esprima.parse(data);
        console.log('\n AST BEFORE REFACTORING: \n');
        console.log(JSON.stringify(ast, null, 4));

        isAbleToReplaceWithBreak(ast);

        code = escodegen.generate(ast);
        console.log("\n\n");
        console.log("---------------------------------------------------------------------------");
        console.log("Refactored code is : ");
        console.log(code); //outputs in the console

        fs.writeFile('../input/output_remove_control_flags.js', code, function (err) {
            if (err) {
                throw err;
            }
        });

    });
};
removeFlagMain();