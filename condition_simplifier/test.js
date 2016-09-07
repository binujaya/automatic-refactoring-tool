//Most stable version to find duplicate nodes and remove them
//shuould handle case when there are if-else-if statements

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
    console.log('\n AST BEFORE REFACTORING: \n');
    console.log(JSON.stringify(ast, null, 4));
    var removedNode = [];
    var nodeToRemove = [];
    //var nodes = [];
    //var parentChain = [];
    var ifStatementBodyArray;
    var elseStatementBodyArray;

    estraverse.traverse(ast, {

        enter: function enter(node, parent) {


            if (node.type === "IfStatement") { //Find conditional statements

                ifStatementBodyArray = node.consequent.body;
                elseStatementBodyArray = node.alternate.body;


            }

        }




    });

    function checkFunctionCallsInArray(array) {
        var functionCallArray = [];
        for (item in array) {
            node = array[item];
            // console.log("node is",node);
            if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression') {
                functionCallArray.push(node.expression.callee.name); //Push all function calls into array

            }




        }
        return functionCallArray;
    }

    function searchItem(item, array) { //Compare in both arrays
        for (i in array) {
            if (array[i] == item) {

                nodeToRemove.push(item);
            }
        }
    }

    function checkElements() { //Search for duplicates

        var ifArray = checkFunctionCallsInArray(ifStatementBodyArray);
        var elseArray = checkFunctionCallsInArray(elseStatementBodyArray);
        for (item in ifArray) {
            searchItem(ifArray[item], elseArray);

        }


    }

    checkElements();








    //    function checkDuplicateElement(array) { //check for duplicates
    //        for (var i = 1; i < array.length; i++) {
    //            if (array[i] !== array[0])
    //                return false;
    //        }
    //        nodeToRemove = array[0];
    //        return true;
    //
    //
    //
    //
    //
    //
    //    }


    //console.log(nodes);
    for (element in nodeToRemove) {
        estraverse.replace(ast, {
            enter: function enter(node) {
                if (
                    'ExpressionStatement' === node.type && 'CallExpression' === node.expression.type && nodeToRemove[element] === node.expression.callee.name
                ) {
                    removedNode.push(node); //Assigning removed Node to a variable
                    return this.remove(); //Reomove the node
                }
            }
        });
    }

    code = escodegen.generate(ast, {
        format: {
            indent: {
                style: '  '
            }
        }
    });

    function checkDuplicateElement(array) { //check for duplicates aim is to append non duplicates at the end of the array
        var duplicateRemovedArray = [];
        for (var i = 1; i < array.length; i++) {
            if ((array[i].expression.callee.name) === (array[i - 1].expression.callee.name)) {
                duplicateRemovedArray.push(array[i]);



            }


        }
        return duplicateRemovedArray;
    }


    duplicateRemovedArray = checkDuplicateElement(removedNode);

    var bst = esprima.parse(code);



    for (element in duplicateRemovedArray) {


        estraverse.traverse(bst, {
            enter: function (node, parent) {
                if (node.type === 'Program') {
                    var beforeNodes = duplicateRemovedArray[element];
                    node.body = node.body.concat(beforeNodes);
                }
            }
        });

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