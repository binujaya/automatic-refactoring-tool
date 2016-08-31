var fs = require('fs');


var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');

fs.readFile('./input.js', 'utf8', function (err, data) {
    if (err) {
        throw err;
    }

    //var code = 'if (discount) { amount = price * 0.90; printBill();}';
    console.log("---------------------------------------------------------------------------");
    console.log("Before refactoring");
    console.log(data);
    var ast = esprima.parse(data);
    //console.log('\n AST BEFORE REFACTORING: \n');
    //console.log(JSON.stringify(ast, null, 4));
    var removedNode;
    var nodeToRemove;
    var nodes = [];
    var parentChain = [];


    estraverse.traverse(ast, {

        enter: function (node, parent) {
            parentChain.push(parent);

        },
        leave: function (node, parent) {

            var grandParent = parentChain[parentChain.length - 3];
            if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression' && grandParent.type === 'BlockStatement') { //should be tested for many cases
                //sould be check whtehr duplicates in if and else
                nodes.push(node.expression.callee.name);
                //console.log("node to remove is",node.expression.callee.name);

                //console.log("grandParent is",grandParent);

            }


        }
    });

    function checkDuplicateElement(array) { //check for duplicates
        for (var i = 1; i < array.length; i++) {
            if (array[i] !== array[0])
                return false;
        }
        nodeToRemove = array[0];
        return true;






    }


    //console.log(nodes);

    estraverse.replace(ast, {
        enter: function enter(node) {
            if (
                'ExpressionStatement' === node.type && 'CallExpression' === node.expression.type && checkDuplicateElement(nodes) && nodeToRemove === node.expression.callee.name
            ) {
                removedNode = node; //Assigning removed Node to a variable
                return this.remove(); //Reomove the node
            }
        }
    });

    code = escodegen.generate(ast, {
        format: {
            indent: {
                style: '  '
            }
        }
    });


    var bst = esprima.parse(code);







    estraverse.traverse(bst, {
        enter: function (node, parent) {
            if (node.type === 'Program') {
                addBeforeCode(node);
            }
        }
    });


    //Adding removed Node at the end.
    function addBeforeCode(node) {

        var beforeNodes = removedNode;
        node.body = node.body.concat(beforeNodes);
    }



    code = escodegen.generate(bst, {
        format: {
            indent: {
                style: '  '
            }
        }
    });
    console.log("\n\n");
    console.log("---------------------------------------------------------------------------");
    console.log("Refactored code is : ");
    console.log(code); //outputs in the console


});