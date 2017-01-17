var express = require('express');
var app = express();
var path = require('path');
var multer = require('multer');
var fs = require('fs');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files');
  },
  filename: function (req, file, cb) {
    cb(null, 'inputFile.js');
  }
});
var upload = multer({ storage: storage });


var esprima = require('esprima');
var escodegen = require('escodegen');

var MethodComposer = require('./method_composer/index.js');
var ConConsolidateConditional = require('./condition_simplifier/consolidate_conditional_expression.js');
var ConConsolidateDuplicate = require('./condition_simplifier/consolidate_duplicate_conditional.js');
var ConRemoveFlags = require('./condition_simplifier/remove_control_flags.js');
var ConReplaceNested = require('./condition_simplifier/replace_nested_conditionals.js');
var parameterizeMethod = require('./method_simplifier/paramerterizedMethod.js');
var removeParameters = require('./method_simplifier/removeParameter.js');
var renameShortNames = require('./method_simplifier/method_rename.js');
var renamePoorNames = require('./method_simplifier/renamePoorName.js');

var refactoredCode, ast;



app.use(express.static(path.join(__dirname,'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'/views/index.html'));
});

app.post('/send_file', upload.single('nonstcode'), function (req, res) {
  fs.readFile(req.file.path, 'utf8', function (err,data) {
    if (err) {
      throw err;
    }
    ast = esprima.parse(data);

    //method composer module
    MethodComposer.addDepthToNodes(ast);
    MethodComposer.removeAssignToParam(ast);
    // TODO: assignments in if conditions must come one level out of scope
    MethodComposer.addInlineMethods(ast);
    // ConConsolidateConditional.consolidateConditionalExpression(ast);//conditionalSimplifier
    MethodComposer.extractVariables(ast);
    // MethodComposer.extractMethods(ast);

    //ConditionalSimplifier module
    // ConConsolidateDuplicate.removeDuplicates(ast);
    // ConRemoveFlags.replaceFunction(ast);
    // ConReplaceNested.replaceNestedConditionals(ast);

    // Method Call Simplifier module
    // parameterizeMethod.searchParameterizeMethods(ast);
    // parameterizeMethod.matchDuplicatemethods(ast);
    // removeParameters.searchRemoveParameter(ast);
    // renameShortNames.searchMethodsName(ast);
    // renamePoorNames.searchMethodsName(ast);

    refactoredCode = escodegen.generate(ast);

    fs.writeFile('./files/ast.js', JSON.stringify(ast, null, 4), function (err) {
      if (err) {
        throw err;
      }
    });
    fs.writeFile('./files/refactoredFile.js', refactoredCode, function (err) {
      if (err) {
        throw err;
      }
    });
    res.send('success');
  });
});

app.get('/ast', function (req,res) {
  res.sendFile(path.join(__dirname+'/files/ast.js'));
});
app.get('/refactoredcode', function (req, res) {
  res.sendFile(path.join(__dirname+'/files/refactoredFile.js'));
});

app.listen(1337);
console.log('find app at port 1337');
