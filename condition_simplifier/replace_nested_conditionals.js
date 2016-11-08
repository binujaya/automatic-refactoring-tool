var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');
var fs = require('fs');
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
    
     estraverse.traverse(ast, {

        enter: function enter(node, parent) {


            if (node.type === "IfStatement" ) {
                console.log("If enetered",parent.type);
                 while (node !== undefined) {

                  if (node.consequent !== undefined) {
                      console.log("nested if found");
                  }
                  node = node.alternate;
                 }

            }

        }
    });
    
    

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