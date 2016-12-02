var fs = require('fs');
var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');
var scopeChain = require('./scopeChain.js').scopeChain;


var findExistInArray = function (array, node) {
    for (var k = 0; k < array.length; k++) {

        if (JSON.stringify(array[k]) === JSON.stringify(node)) {
            return true;
        }
    }
    return false;

};

var findConditionals = function (array) { //shuld be removed


    var ifArray = [];
    var combinedNode;
    var startingIndex;
    var consequent;
    var alternate;

    for (var i = 0; i < array.length; i++) {


        if (array[i].type !== undefined && array[i].type === "IfStatement") {
            if (consequent === undefined) { //first time
                consequent = array[i].consequent;
                alternate = array[i].alternate;
                ifArray.push(array[i]);


            } else {
                if ((array[i].consequent === consequent) && (array[i].alternate === alternate)) {
                    ifArray.push(array[i]);

                }




            }

        }
    }

    if (ifArray.length > 1) {

        for (var k = 0; k < array.length; k++) { //remove the nodes
            if (findExistInArray(ifArray, array[k])) {
                array.splice(k, 1);
                k = k - 1; //start again from begining   
            }

        }
        // createArrayOfArrays(ifArray);
        combinedNode = createCombinedIf(ifArray);
        array.push(combinedNode);
    }
};



var findSuitableIfs = function (array) {


    var ifArray = [];
    var combinedIfArray;
    var combinedNode;
    var startingIndex;
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array.length; j++) {

            if ((i !== j) && !findExistInArray(ifArray, array[i]) && array[i].consequent !== undefined && array[i].alternate !== undefined) {

                if ((JSON.stringify(array[i].consequent) === JSON.stringify(array[j].consequent)) && (JSON.stringify(array[i].alternate) === JSON.stringify(array[j].alternate))) {

                    ifArray.push(array[i]);

                }
            }
        }
    }

    if (ifArray.length > 1) {

        for (var k = 0; k < array.length; k++) { //remove the nodes
            if (findExistInArray(ifArray, array[k])) {
                array.splice(k, 1);
                k = k - 1; //start again from begining   
            }

        }
        combinedIfArray = createArrayOfArrays(ifArray);
        for (element in combinedIfArray) {
            array.push(combinedIfArray[element]);
        }
    }
};

var createArrayOfArrays = function (array) {

    result = [];
    newElements = [];

    array.forEach(function (a) {
        JSON.stringify(a.consequent) in this || result.push(this[JSON.stringify(a.consequent)] = []);
        this[JSON.stringify(a.consequent)].push(a);
    }, Object.create(null));

    for (item in result) {
        var combinedNode = createCombinedIf(result[item]);
        newElements.push(combinedNode);
    }

    return newElements;

};

var createCombinedIf = function (array) {

    var ifArrayLocal = array;
    var type = "IfStatement";
    var test = JSON.stringify(createComnibnedTestForOr(ifArrayLocal));
    var consequent = JSON.stringify(array[0].consequent); //shuld be changed
    var alternate = JSON.stringify(array[0].alternate);
    return JSON.parse(`{
     "type": "${type}",
     "test": ${test},
     "consequent":${consequent} ,
     "alternate": ${alternate}
 }`);




};


var createComnibnedTestForOr = function (array) { //recusrsive procedure to create composite test node
    var left, right;
    if (array.length > 1) {
        right = JSON.stringify(array[array.length - 1].test);
        if (array.length === 2) {
            left = JSON.stringify(array[array.length - 2].test);
        } else if (array.length > 2) {
            array.splice(array.length - 1, 1);
            left = JSON.stringify(createComnibnedTestForOr(array));
        }
        return JSON.parse(`{
     
     "type": "LogicalExpression",
     "operator": "||",
     "left": ${left},
     "right": ${right}
     }`);
    }
};

var consolidateConditionalExpression = function (ast) {
    estraverse.traverse(ast, {

        enter: function enter(node, parent) {
            scopeChain.push(node);

            if (node.body !== undefined && Array.isArray(node.body)) {
                findSuitableIfs(node.body);
                //findConditionals(node.body);
            }

        },

        leave: function (node, parent) {
            scopeChain.pop();

        }
    });

    return ast;
};









var consolidateConditionalsMain = function () {
    fs.readFile('../input/input_consolidate_conditional_expression.js', 'utf8', function (err, data) {
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

        consolidateConditionalExpression(ast);

        code = escodegen.generate(ast);
        console.log("\n\n");
        console.log("---------------------------------------------------------------------------");
        console.log("Refactored code is : ");
        console.log(code); //outputs in the console

        fs.writeFile('../input/output_consolidate_conditional_expression.js', code, function (err) {
            if (err) {
                throw err;
            }
        });

    });
};
consolidateConditionalsMain();
//want to handle if multiple duplicates in if array are present ex:[1,1,1,2,2,3]
//want to handle and case
//handle only ex: [1,1,1,1]