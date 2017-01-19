//fixes requiredversion1
//me widyata karanna pulwan ekakda kiyala balanna thiynwa
var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');
var fs = require('fs');
var scopeChain = require('./scopeChain.js').scopeChain;


var foundIfInArray = function (array) {
    if (array !== undefined) {

        for (var i = 0; i < array.length; i++) {
            var node = array[i];
            if (node.type === "IfStatement") {
                return true;

            };
        }
    }
    return false;
};
//function to traverse nested if and compute the new node array
var replaceHelper = function (node, name) {
    var newNodes = [];
    while (node !== undefined) {
        newNodes.push(createSeparateIf(node, name));
        var position;
        if (node.alternate !== undefined) position = findNodeIndex("IfStatement", node.alternate.body);
        if (position !== undefined) node = node.alternate.body[position];
        else node = node.alternate;
    }
    return newNodes;
};

var findNodeIndex = function (statement, array, name) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].type === "ExpressionStatement" && checkVarExists(name) && array[i].expression.left.name === name) {
            return i;
        } else if (array[i].type === statement) {
            return i;
        }

    }


};

var checkVarExists = function (variable) {
    if (variable !== undefined && variable !== null) {
        return true;

    }
    return false;




};
var checkForNestedIf = function (node) {
    if (node.alternate !== null && node.alternate !== undefined) {
        if (foundIfInArray(node.alternate.body)) { //added validation
            return true;
        }
    }
    return false;
}

var isInsideFunction = function () {
    if (scopeChain.getGrandParentNode() !== undefined && (scopeChain.getGrandParentNode().type === "FunctionExpression" || scopeChain.getGrandParentNode().type === "FunctionDeclaration")) {
        return true;
    }
    return false;


}

var replaceNestedConditionals = function (ast) {
    var variableName;
    estraverse.traverse(ast, {

        enter: function enter(node, parent) {
            var nodes;


            scopeChain.push(node);
            if ((node.type === "VariableDeclarator") && (node.id.type === "Identifier")) {
                variableName = node.id.name;

            }

            if (node.type === "IfStatement" && checkForNestedIf(node) && (isInsideFunction())) {
                nodes = replaceHelper(node, variableName);
                var index = findIndexOfArray(parent.body, node);
                parent.body.splice(index, 2); //remove current node assumption next node is return statement
                for (var k = 0; k < nodes.length; k++) {
                    parent.body.splice(index + k, 0, nodes[k]);
                }
            }

        },
        leave: function (node, parent) {
            scopeChain.pop();
        }


    });
    return ast;
};

var removeNode = function (ast, element) {
    estraverse.replace(ast, {

        enter: function enter(node, parent) {
            if (JSON.stringify(element) === JSON.stringify(node)) {
                return this.remove();

            }


        },



    });
    return ast;



}

var findIndexOfArray = function (array, node) {
    return array.indexOf(node);
};

var createSeparateIf = function (node, name) {
    if (node.type === "IfStatement") {

        var position = findNodeIndex("ExpressionStatement", node.consequent.body, name);
        var copyOfBody = node.consequent.body.slice();
        if (node.test !== undefined && node.consequent.body[position].expression !== undefined) {
            var test = JSON.stringify(node.test);
            var argument = JSON.stringify(node.consequent.body[position].expression.right);
            if (copyOfBody.length > 1) {
                var newReturnNode = JSON.parse(`{
             
                 "type": "ReturnStatement",
                 "argument": ${argument}
             

            }`);
                var newArray = copyOfBody;
                var newBody = JSON.stringify(newArray);

                return JSON.parse(`{
     "type": "IfStatement",
     "test": ${test},
     "consequent": {
         "type": "BlockStatement",
         "body": ${newBody}
     },
     "alternate": null
 }`);




            } else {

                return JSON.parse(`{
     "type": "IfStatement",
     "test": ${test},
     "consequent": {
         "type": "BlockStatement",
         "body": [
             {
                 "type": "ReturnStatement",
                 "argument": ${argument}
             }
         ]
     },
     "alternate": null
 }`);
            }
        }
    } else if (node.type === "BlockStatement") {
        var position = findNodeIndex("ExpressionStatement", node.body, name);

        if (node.body[position].expression !== undefined) {
            var argument = JSON.stringify(node.body[position].expression.right);
            return JSON.parse(`{
     "type": "ReturnStatement",
     "argument": ${argument} ,
     "arguments": []
     }`);
        }
    };

}




var replaceMain = function () {
    fs.readFile('../input/input_nested_conditionals.js', 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        console.log("---------------------------------------------------------------------------");
        console.log("Before refactoring");
        console.log(data);
        var ast = esprima.parse(data);
        console.log('\n AST BEFORE REFACTORING: \n');
        console.log(JSON.stringify(ast, null, 4));


        replaceNestedConditionals(ast);

        //        console.log('\n AST AFTER REFACTORING: \n');
        //        console.log(JSON.stringify(ast, null, 4));

        code = escodegen.generate(ast);
        console.log("\n\n");
        console.log("---------------------------------------------------------------------------");
        console.log("Refactored code is : ");
        console.log(code); //outputs in the console

        fs.writeFile('../input/output_nested_conditionals.js', code, function (err) {
            if (err) {
                throw err;
            }
        });

    });
};
replaceMain();
module.exports = {
    foundIfInArray: foundIfInArray,
    replaceHelper: replaceHelper,
    findNodeIndex: findNodeIndex,
    checkForNestedIf: checkForNestedIf,
    isInsideFunction: isInsideFunction,
    replaceNestedConditionals: replaceNestedConditionals,
    removeNode: removeNode,
    findIndexOfArray: findIndexOfArray,
    createSeparateIf: createSeparateIf
};