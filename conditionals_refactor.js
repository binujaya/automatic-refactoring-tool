var fs = require('fs');
var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');

var ConditionalSimplifier = require('./condition_simplifier/remove_duplicates.js');

fs.readFile('./input/input.js', 'utf8', function (err, data) {
//fs.readFile('./input/input_if_1.js', 'utf8', function (err, data) {   
    if (err) {
        throw err;
    }
//    var data = "var discount = true;var amount;if(discount){amount = price *  0.9;printBill();}else{amount=price;printBill();}";
    console.log("---------------------------------------------------------------------------");
    console.log("Before refactoring");
    console.log(data);
    var ast = esprima.parse(data);
    console.log('\n AST BEFORE REFACTORING: \n');
    console.log(JSON.stringify(ast, null, 4));
    
    var bst = ConditionalSimplifier.removeDuplicates(ast);

    code = escodegen.generate(bst);
    console.log("\n\n");
    console.log("---------------------------------------------------------------------------");
    console.log("Refactored code is : ");
    console.log(code); //outputs in the console
    
    fs.writeFile('./input/outFile.js', code, function (err) {
    if (err) {
      throw err;
    }
   });

});