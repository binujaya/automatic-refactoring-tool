var fs = require('fs');


var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');

fs.readFile('./input.js','utf8', function (err,data) {
  if (err) {
    throw err;
  }

//var code = 'if (discount) { amount = price * 0.90; printBill();}';
console.log("---------------------------------------------------------------------------");  
console.log("Before refactoring");    
console.log(data);
var ast = esprima.parse(data);
//console.log('\n AST BEFORE REFACTORING: \n');
//console.log(JSON.stringify(ast, null, 4));
var removedNode;    

estraverse.replace(ast, {
  enter: function enter(node) {
    if (
        'ExpressionStatement' === node.type
      && 'CallExpression' === node.expression.type
      && 'printBill' === node.expression.callee.name
    ) {
      removedNode=node;//Asigning removed Node to a variable
      return this.remove();//Reomove the node
    }
  }
});
    
code = escodegen.generate(ast, {
  format: {
    indent: { style: '  ' }
  }
});

    
var bst = esprima.parse(code);


    
    
 
   
    
 estraverse.traverse(bst, {
        enter: function(node, parent) {
            if (node.type === 'Program') {
                addBeforeCode(node);
            }
        }
    });

    
//Adding removed Node at the end.
function addBeforeCode(node) {
   
    var beforeNodes = removedNode;
     node.body = node.body.concat(beforeNodes);
}  
 
    
    
code = escodegen.generate(bst, {
  format: {
    indent: { style: '  ' }
  }
});
console.log("\n\n");
console.log("---------------------------------------------------------------------------"); 
console.log("Refactored code is : ");
console.log(code);//outputs in the console

    
});