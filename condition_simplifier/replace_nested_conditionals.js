//fixes requiredversion1
//me widyata karanna pulwan ekakda kiyala balanna thiynwa
var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');
var fs = require('fs');
var scopeChain = require('./scopeChain.js').scopeChain;


var found_if_in_array = function (array) {
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
var replace_helper = function (node) {
    var newNodes = [];
    while (node !== undefined) {
        newNodes.push(create_separate_if(node));
        var position;
        if (node.alternate !== undefined) position = find_node_index("IfStatement", node.alternate.body);
        if (position !== undefined) node = node.alternate.body[position];
        else node = node.alternate;
    }
    return newNodes;
};

var find_node_index = function (statement, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].type === statement) {
            return i;
        }

    }


};

var check_for_nested_if = function (node) {
    if (node.alternate !== null && node.alternate !== undefined) {
        if (found_if_in_array(node.alternate.body)) {
            return true;
        }
    }
    return false;
}

var isInsideFunction = function () {
    if (scopeChain.getGrandParentNode() !== undefined && scopeChain.getGrandParentNode().type === "FunctionExpression") {
        return true;
    }
    return false;


}

var replace_nested_conditionals = function (ast) {
    estraverse.traverse(ast, {
        enter: function enter(node, parent) {
            var nodes;

            scopeChain.push(node);
            if(node.type === "ReturnStatement" && isInsideFunction()){//delete the existing return statement of a function
            var index = find_indexOfArray(parent.body, node);
            parent.body.splice(index, 1);    
                
                
            }

            if (node.type === "IfStatement" && check_for_nested_if(node) && (isInsideFunction())) {
                nodes = replace_helper(node);
                var index = find_indexOfArray(parent.body, node);
                parent.body.splice(index, 1); //remove current node
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

var remove_node = function (ast, element) {
    estraverse.replace(ast, {

        enter: function enter(node, parent) {
            if (JSON.stringify(element) === JSON.stringify(node)) {
                return this.remove();

            }


        },



    });
    return ast;



}

var find_indexOfArray = function (array, node) {
    return array.indexOf(node);
};

var create_separate_if = function (node) {
    if (node.type === "IfStatement") {
        var position = find_node_index("ExpressionStatement", node.consequent.body);
        if (node.test !== undefined && node.consequent.body[position].expression !== undefined) {
            var test = JSON.stringify(node.test);
            var argument = JSON.stringify(node.consequent.body[position].expression.right); 
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
    } else if (node.type === "BlockStatement") {

        var position = find_node_index("ExpressionStatement", node.body);

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




var replace_main = function () {
    fs.readFile('../input/input_nested_conditionals.js', 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        console.log("---------------------------------------------------------------------------");
        console.log("Before refactoring");
        console.log(data);
        var ast = esprima.parse(data);
//        console.log('\n AST BEFORE REFACTORING: \n');
//        console.log(JSON.stringify(ast, null, 4));


        replace_nested_conditionals(ast);

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
replace_main();