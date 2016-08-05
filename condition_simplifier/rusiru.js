var fs = require('fs');

var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');

var removedNode;
var parentNode;

fs.readFile('./input.js','utf8', function (err,data) {
  if (err) {
    throw err;
  }

var ast = esprima.parse(data);

console.log('\n AST BEFORE REFACTORING: \n');
console.log(JSON.stringify(ast, null, 4));
    
var changeNode=function(node,parent){
    
  
  
  
    parent.callee=null;
    parent.arguments=null;
    parent.type=null;
    
    return parent;
    
    
    
};

var changeAST = function (ast) {
    estraverse.traverse(ast, {
        enter: function (node, parent) {

            if (node.type == 'Identifier' && node.name == 'printBill' && parent.type != 'VariableDeclarator') {
                removedNode=node;
                parentNode=parent;
                changeNode(node,parent);
                
            
                
                
            
            }
        }
    });
    
    
    
    
//    estraverse.replace(ast, {
//        enter: function (node) {
//
//            if (node.type == 'Identifier' && node.name == 'printBill' ) {
//                
//                
//                estraverse.VisitorOption.Remove;
//                
//            
//            }
//        }
//    });
    
    
    
    
    
    
    
    
    
    
    
    
};

changeAST(ast);
console.log("Removed node is",removedNode);
console.log("Parent node is",parentNode);

var refactoredCode = escodegen.generate(ast);

console.log('\n\n REFACTORED CODE: \n');
console.log(refactoredCode);
    
});