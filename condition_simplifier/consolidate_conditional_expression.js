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


var findSuitableIfs = function (array) {


    var ifArray = [];
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array.length; j++) {

            if ((i !== j) && !findExistInArray(ifArray, array[i]) && array[i].consequent !== undefined && array[i].alternate !== undefined) {

                if ((JSON.stringify(array[i].consequent) === JSON.stringify(array[j].consequent)) && (JSON.stringify(array[i].alternate) === JSON.stringify(array[j].alternate))) {
                    console.log(array[i]);
                    ifArray.push(array[i]);

                }

            }


        }
    }


    //if consquent and alternate are same for all ifs
    //make a single if combine the test with ors
    //one consequent and one alternate

};


var consolidateConditionalExpression = function (ast) {
    estraverse.traverse(ast, {

        enter: function enter(node, parent) {
            scopeChain.push(node);

            if (node.body !== undefined && Array.isArray(node.body)) {


                findSuitableIfs(node.body);



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