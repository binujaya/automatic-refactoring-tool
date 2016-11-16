//http://stackoverflow.com/questions/3524970/why-does-lua-have-no-continue-statement

var fs = require('fs');
var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');
var scopeChain = require('./scopeChain.js').scopeChain;



var findControlFlagVaraible = function (array, value,name) {
    var newValue;
    newValue = value ? false : true;
    for (var k = 0; k < array.length; k++) {
        if(array[k].declarations !== undefined && array[k].declarations !== null){
        var node = array[k].declarations[0];
        if (node.type === "VariableDeclarator" && node.init.value === newValue && node.id.name === name) {

            return true;
        }
        }
    }
    return false;
};

var replaceWithBreak = function (ast, newNode) {

    var breakNode = JSON.parse(`{
      "type": "BreakStatement",
      "label": null
 }`);
    estraverse.replace(ast, {
        enter: function (node, parent) {
            if (JSON.stringify(newNode) === JSON.stringify(node)) {
                return breakNode;
            }
        }
    });
};



var replaceFunction = function (ast) {

    estraverse.traverse(ast, {

        enter: function enter(node, parent) {
            scopeChain.push(node);


            var findWhile = scopeChain.find('WhileStatement');
            var findDoWhile = scopeChain.find('DoWhileStatement'); //replace with break
            var findFor = scopeChain.find('ForStatement');
            var findForIn = scopeChain.find('ForInStatement');
            var findForOf = scopeChain.find('ForOfStatement');
            var findIf = scopeChain.find('IfStatement');

            if (node.type === "AssignmentExpression" && (findWhile || findDoWhile || findFor)) {
                var position;

                if (scopeChain.getGrandParentNode().type === "BlockStatement") position = scopeChain.getCurrentBlock().indexOf(parent);
                else {
                    position = scopeChain.getCurrentBlock().indexOf(scopeChain.getGrandParentNode());
                }

                if (findWhile) {
                    var whileNode = scopeChain.getNode('WhileStatement');
                    var parentNode = scopeChain.getParentNode('WhileStatement');
                    if (whileNode.test !== undefined) {

                        if ((node.left.name === whileNode.test.name) && findControlFlagVaraible(parentNode.body, node.right.value,node.left.name)) {
                            replaceWithBreak(scopeChain.getGrandParentNode(), parent);
                        }
                    }

                }
                if (findDoWhile) {
                    var whileNode = scopeChain.getNode('DoWhileStatement');
                    var parentNode = scopeChain.getParentNode('DoWhileStatement');
                    if (whileNode.test !== undefined) {
                        if ((node.left.name === whileNode.test.name)&& findControlFlagVaraible(parentNode.body,  node.right.value,node.left.name)){

                            replaceWithBreak(scopeChain.getGrandParentNode(), parent);

                        }
                    }
                }
                if ((findFor || findForIn || findForOf) && (findIf)) {
                    if (findFor) parentNode = scopeChain.getParentNode('ForStatement');
                    if (findForIn) parentNode = scopeChain.getParentNode('ForInStatement');
                    if (findForOf) parentNode = scopeChain.getParentNode('ForOfStatement');
                    var IfNode = scopeChain.getNode("IfStatement");
                    if ((IfNode.test.argument.name === node.left.name)&&(findControlFlagVaraible(parentNode.body,  node.right.value,node.left.name))) {

                        replaceWithBreak(scopeChain.getGrandParentNode(), parent);

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

        replaceFunction(ast);

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