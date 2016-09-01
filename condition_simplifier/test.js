//Most stable version to find duplicate nodes and remove them
//Should handle case when there are two duplicate function calls
//shuould handle case when there are if-else-if statements

var fs = require('fs');


var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');

fs.readFile('./input.js', 'utf8', function (err, data) {
    if (err) {
        throw err;
    }

    //var code = 'if (discount) { amount = price * 0.90; printBill();}';
    console.log("---------------------------------------------------------------------------");
    console.log("Before refactoring");
    console.log(data);
    var ast = esprima.parse(data);
    console.log('\n AST BEFORE REFACTORING: \n');
    console.log(JSON.stringify(ast, null, 4));
    var removedNode;
    var nodeToRemove;
    //var nodes = [];
    //var parentChain = [];
var ifStatementBodyArray;
var elseStatementBodyArray;

    estraverse.traverse(ast, {

        enter: function enter(node,parent) {
        
            
            if(node.type === "IfStatement"){//Find conditional statements

                ifStatementBodyArray=node.consequent.body;
                elseStatementBodyArray=node.alternate.body;
            
                
            }

        }
       
       

        
    });
    
    function checkFunctionCallsInArray(array){
        var functionCallArray=[];
        for  (item in array){
            node=array[item];
           // console.log("node is",node);
            if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression'){
                functionCallArray.push(node.expression.callee.name);//Push all function calls into array
            
            }
            
        
        
        
    }
        return functionCallArray;
    }

function searchItem(item,array){//Compare in both arrays
   for(i in array){ 
    if(array[i]==item){
    
      nodeToRemove=item;
     console.log("node to remove is",nodeToRemove);
     }
   }
}
    
function checkElements(){//Search for duplicates
    
var ifArray=checkFunctionCallsInArray(ifStatementBodyArray);
var elseArray=checkFunctionCallsInArray(elseStatementBodyArray);
     for(item in ifArray){
         searchItem(ifArray[item],elseArray);
         
     }
    
    
}

checkElements();
    


    
    

    

//    function checkDuplicateElement(array) { //check for duplicates
//        for (var i = 1; i < array.length; i++) {
//            if (array[i] !== array[0])
//                return false;
//        }
//        nodeToRemove = array[0];
//        return true;
//
//
//
//
//
//
//    }


    //console.log(nodes);

    estraverse.replace(ast, {
        enter: function enter(node) {
            if (
                'ExpressionStatement' === node.type && 'CallExpression' === node.expression.type && nodeToRemove === node.expression.callee.name
            ) {
                removedNode = node; //Assigning removed Node to a variable
                return this.remove(); //Reomove the node
            }
        }
    });

    code = escodegen.generate(ast, {
        format: {
            indent: {
                style: '  '
            }
        }
    });


    var bst = esprima.parse(code);







    estraverse.traverse(bst, {
        enter: function (node, parent) {
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
            indent: {
                style: '  '
            }
        }
    });
    console.log("\n\n");
    console.log("---------------------------------------------------------------------------");
    console.log("Refactored code is : ");
    console.log(code); //outputs in the console


});