//Most stable version to find duplicate nodes and remove them
var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');

var removedNode = [];
var nodeToRemove = [];
var ifArray = []; //new
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
        var node = array[i];

        //console.log("node is",node);
        //consequent=== if statement
        //alternate.consequent === else if statements
        //alternate=== else statement
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
                    //console.log("looping", functionCalls[item].expression.callee.name);
                    //                    if(item === 0){
                    //                        newPreviousFunctionCalls=functionCalls;
                    //                    }

                    for (i in previousFunctionCalls) {

                        // console.log(functionCalls[i]);
                        // console.log(item);
                        if (JSON.stringify(functionCalls[item]) === JSON.stringify(previousFunctionCalls[i])) {
                            // console.log("loop entered");
                            // console.log("inside new loop", functionCalls[item].expression.callee.name);
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
                console.log(previousFunctionCalls[l]);
                //nodeToRemove.push(previousFunctionCalls[l]);
            }
        }



    }





};


var removeDuplicates = function (ast) {


    estraverse.traverse(ast, {

        enter: function enter(node, parent) {


            //            if (node.type === "IfStatement") { //Find conditional statements
            //                console.log("parent ",parent.type);
            //                console.log("consequent",node.consequent.body);
            //                console.log("alternate",node.alternate.body);
            //                
            //                ifStatementBodyArray = node.consequent.body;
            //                elseStatementBodyArray = node.alternate.body;
            //                
            //
            //            }
            if (node.type === "IfStatement" && parent.type === "Program" && node.alternate.body !== undefined) {
                ifStatementBodyArray = node.consequent.body;
                elseStatementBodyArray = node.alternate.body;

            } else if (node.type === "IfStatement" && parent.type === "Program") {


                //check function calls in body array
                //Go upaward until meet node.type === "IfStatement" && parent.type === "Program"
                //check all have same function name
                //if remove that nodes and insert at once after if statement

                //console.log(node);
                ifArray.push(node);
                //ifTraversal(ifArray);

                //                        var array = node.alternate.body;
                //                        for (item in array) {
                //                            node = array[item];
                //                            if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression') {
                //                                // functionCallArray.push(node.expression.callee.name); //Push all function calls into array
                //                                console.log("function calls detected", node);
                //                                
                //                                //functionCallArray.push(node);
                //                                
                //                                
                //                            }
                //
                //                        }
            }

        }




    });

    checkElements();
    ifTraversal(ifArray); //newly added

    for (element in nodeToRemove) {
        estraverse.replace(ast, {
            enter: function enter(node) {
                if (
                    'ExpressionStatement' === node.type && 'CallExpression' === node.expression.type && JSON.stringify(nodeToRemove[element]) === JSON.stringify(node)
                ) {
                    removedNode.push(node); //pushing  removed Node to the array
                    return this.remove(); //Reomove the node
                }
            }
        });
    }
    code = escodegen.generate(ast);





    duplicateRemovedArray = checkDuplicateElement(removedNode);

    var bst = esprima.parse(code);



    for (element in duplicateRemovedArray) {
        //
        console.log(duplicateRemovedArray[element]);

        estraverse.traverse(bst, {
            enter: function (node, parent) {
                if (node.type === 'Program') {
                    var beforeNodes = duplicateRemovedArray[element];
                    node.body = node.body.concat(beforeNodes);
                }
            }
        });

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