var fs = require('fs');
var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');
var scopeChain = require('./scopeChain.js').scopeChain;

/*
Input array
Check whether function calls are prsent 
Put those ast function call nodes into functioncallarray
Returns functionCallArray
*/
var checkFunctionCallsInArray = function (array) {

    var functionCallArray = [];
    for (item in array) {
        node = array[item];
        if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression') {
            functionCallArray.push(node);
        }
    }
    return functionCallArray;
};

/*
Input item,array
search for duplicate items
Put them in nodeToRemove array
*/
var searchItem = function (item, array) { //Compare in both arrays
    for (i in array) {
        if (JSON.stringify(array[i]) === JSON.stringify(item)) {
            return i;
        }
    }
    return -1;
}



var findDuplicates = function (node) {
    var nodeInitial = node;
    var bodyArray;
    var functionCalls;
    var previousFunctionCalls;
    var newPreviousFunctionCalls = [];
    var k = 0;
    while (node !== undefined && node !== null) {

        if (node.consequent !== undefined) {
            bodyArray = node.consequent.body;

        } else {
            bodyArray = node.body;
        }
        //previousFunctionCalls = functionCalls;
        functionCalls = checkFunctionCallsInArray(bodyArray);

        // e welwe thiyana function calls tika me array eke                                                                            thiynwa
        // console.log("previousFunctionCalls",previousFunctionCalls);
        //console.log("functionCalls",functionCalls);
        if (functionCalls !== undefined) {
            for (item in functionCalls) {
                for (i in previousFunctionCalls) {

                    if (JSON.stringify(functionCalls[item]) === JSON.stringify(previousFunctionCalls[i])) {
                        newPreviousFunctionCalls.push(functionCalls[item]);
                    }
                }
            }
            if (k == 0) {
                previousFunctionCalls = functionCalls;
            } else {

                previousFunctionCalls = newPreviousFunctionCalls;
            }
            newPreviousFunctionCalls = [];

        }
        //functionCalls = newPreviousFunctionCalls;

        node = node.alternate;
        k++;
        //two arrays previouse and new
        // if only it ocuurs in previus it will go into new 
    }
    deleteDuplicates(nodeInitial, previousFunctionCalls);
    return previousFunctionCalls;
};

var deleteDuplicates = function (node, array) {
    var parent;
    var bodyArray;


    while (node !== undefined && node !== null) {

        if (node.consequent !== undefined) {
            bodyArray = node.consequent.body;

        } else {
            bodyArray = node.body;
        }
        for (item in array) {
            var position = searchItem(array[item], bodyArray);
            if (position !== -1) {
                bodyArray.splice(position, 1);
            }

        }
        parent = node;
        node = node.alternate;
    }

};

var findIndexOfArray = function (array, node) {
    return array.indexOf(node);
};

var removeDuplicates = function (ast) {
    estraverse.traverse(ast, {

        enter: function enter(node, parent) {
            scopeChain.push(node);
            var newNodes = [];

            if (node.type === "IfStatement" && ((parent.type === "Program"|| parent.type === "FunctionExpression") || scopeChain.getGrandParentNode().type === "FunctionDeclaration")) {

                newNodes = findDuplicates(node);
                var index = findIndexOfArray(parent.body, node);
                for (var k = 0; k < newNodes.length; k++) {
                    parent.body.splice(index + (k + 1), 0, newNodes[k]);
                }

            }

        },

        leave: function (node, parent) {
            scopeChain.pop();

        }
    });
};

var duplicateMain = function () {
    fs.readFile('../input/input.js', 'utf8', function (err, data) {
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

        removeDuplicates(ast);

        code = escodegen.generate(ast);
        console.log("\n\n");
        console.log("---------------------------------------------------------------------------");
        console.log("Refactored code is : ");
        console.log(code); //outputs in the console

        fs.writeFile('../input/outFile.js', code, function (err) {
            if (err) {
                throw err;
            }
        });

    });
};
//duplicateMain();
module.exports = {
    checkFunctionCallsInArray:checkFunctionCallsInArray,
    searchItem:searchItem,
    findDuplicates:findDuplicates,
    deleteDuplicates:deleteDuplicates,
    findIndexOfArray:findIndexOfArray,
    removeDuplicates:removeDuplicates 
};