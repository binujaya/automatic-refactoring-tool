//Most stable version to find duplicate nodes and remove them
var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');

var removedNode = [];
var nodeToRemove = [];
var ifArray = [];
var duplicateRemovedArray = []; //new
var ifStatementBodyArray;
var elseStatementBodyArray;

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
            // functionCallArray.push(node.expression.callee.name); //Push all function calls into array
            //console.log("fuction calls", node.expression.callee.name);

            functionCallArray.push(node);
        }




    }
    return functionCallArray;
}

/*
Input item,array
search for duplicate items
Put them in nodeToRemove array
*/
var searchItem = function (item, array) { //Compare in both arrays
    for (i in array) {
        //console.log(array[i]);
        //console.log(item);
        if (JSON.stringify(array[i]) === JSON.stringify(item)) {

            //nodeToRemove.push(item.expression.callee.name);
            nodeToRemove.push(item);
        }
    }
}

var checkElements = function () { //Search for duplicates

    var ifArray = checkFunctionCallsInArray(ifStatementBodyArray);
    var elseArray = checkFunctionCallsInArray(elseStatementBodyArray);
    for (item in ifArray) {

        searchItem(ifArray[item], elseArray);

    }


}

var checkDuplicateElement = function (array) { //check for duplicates aim is to append non duplicates at the end of the array
    var duplicateRemovedArray = [];
    for (var i = 1; i < array.length; i++) {
        if ((array[i].expression.callee.name) === (array[i - 1].expression.callee.name)) {
            duplicateRemovedArray.push(array[i]);



        }


    }
    return duplicateRemovedArray;
}

var ifTraversal = function (array) {
    var bodyArray;
    var functionCalls;
    var previousFunctionCalls;
    var newPreviousFunctionCalls = [];
    for (i in array) {
        var node = array[i].value;
        var key = array[i].key;
        console.log("node is", key);
        var k = 0;
        while (node !== undefined) {

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

                //console.log("new array",newPreviousFunctionCalls);
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
        if (previousFunctionCalls.length > 0) {
            for (l in previousFunctionCalls) {
                var object = {
                    key: key,
                    value: previousFunctionCalls[l]
                };
                nodeToRemove.push(previousFunctionCalls[l]);
                duplicateRemovedArray.push(object);
            }
        }



    }





};


var removeDuplicates = function (ast) {


    estraverse.traverse(ast, {

        enter: function enter(node, parent) {


            if (node.type === "IfStatement" && parent.type === "Program") {


                //check function calls in body array
                //Go upaward until meet node.type === "IfStatement" && parent.type === "Program"
                //check all have same function name
                //if remove that nodes and insert at once after if statement
                console.log("index is", (parent.body).indexOf(node));
                //ifArray.push(node);
                var object = {
                    key: (parent.body).indexOf(node),
                    value: node
                };
                ifArray.push(object);

            }

        }
    });

    checkElements();
    ifTraversal(ifArray); //newly added

    for (element in nodeToRemove) {
        estraverse.replace(ast, {
            enter: function enter(node, parent) {
                if (
                    'ExpressionStatement' === node.type && 'CallExpression' === node.expression.type && (JSON.stringify(nodeToRemove[element]) === JSON.stringify(node)) && parent.type !== 'Program') {


                    //removedNode.push(node); //pushing  removed Node to the array
                    return this.remove(); //Reomove the node
                }
            }
        });
    }
    code = escodegen.generate(ast);

    var bst = esprima.parse(code);
    //var item = ifArray[element];
    //console.log("length of array", ifArray.length);
    var insertNode = function (ast, position, element) {
        estraverse.traverse(ast, {
            enter: function (node, parent) {
                if (node.type === "Program") {
                    // console.log(item.key+1);
                    //console.log(item.value);
                    //var index = (parent.body).indexOf(node);

                    //parent.body.splice(index + 1, 0, duplicateRemovedArray.shift());
                    // parent.body.splice(position + 1, 0, element);
                    console.log("position is", position);
                    node.body.splice(position, 0, element);
                    //eka traversal ekak liyala eken remove karala apahu danna one..

                }
            }
        });
    };
    for (element in duplicateRemovedArray) {
        var position = element * 1 + (duplicateRemovedArray[element].key) * 1 + 1;
        console.log("position is", position);
        insertNode(bst, position, duplicateRemovedArray[element].value);

    }
    return bst;



}
module.exports = {
    removeDuplicates: removeDuplicates,
    checkFunctionCallsInArray: checkFunctionCallsInArray,
    searchItem: searchItem,
    checkElements: checkElements,
    checkDuplicateElement: checkDuplicateElement
};