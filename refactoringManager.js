var esprima = require('esprima');
var escodegen = require('escodegen');

var depthCalculator = require('./method_composer/depthCalculator.js');
var MethodComposer = require('./method_composer/refactoringEngine.js');
var ConConsolidateConditional = require('./condition_simplifier/consolidate_conditional_expression.js');
var ConConsolidateDuplicate = require('./condition_simplifier/consolidate_duplicate_conditional.js');
var ConRemoveFlags = require('./condition_simplifier/remove_control_flags.js');
var ConReplaceNested = require('./condition_simplifier/replace_nested_conditionals.js');
var parameterizeMethod = require('./method_simplifier/paramerterizedMethod.js');
var removeParameters = require('./method_simplifier/removeParameter.js');
var renameShortNames = require('./method_simplifier/method_rename.js');
var renamePoorNames = require('./method_simplifier/renamePoorName.js');

var start = function (inputCode,options) {
  var refactoredCode, ast;
  ast = esprima.parse(inputCode);
  depthCalculator.addDepthToNodes(ast);
  if (options[2]!='') MethodComposer.removeAssignToParam(ast);
  if (options[0]!='') MethodComposer.addInlineMethods(ast); // TODO: assignments in if conditions must come one level out of scope
  if (options[3]!='') ConConsolidateConditional.consolidateConditionalExpression(ast);//conditionalSimplifier
  if (options[1]!='') MethodComposer.extractVariables(ast);
  // MethodComposer.extractMethods(ast);
  if (options[4]!='') ConConsolidateDuplicate.removeDuplicates(ast);
  if (options[6]!='') ConRemoveFlags.replaceFunction(ast);
  if (options[5]!='') ConReplaceNested.replaceNestedConditionals(ast);
  if (options[9]!='') parameterizeMethod.searchParameterizeMethods(ast);
  if (options[9]!='') parameterizeMethod.matchDuplicatemethods(ast);
  if (options) removeParameters.searchRemoveParameter(ast);
  if (options[7]!='') renameShortNames.searchMethodsName(ast);
  if (options[8]!='') renamePoorNames.searchMethodsName(ast);

  refactoredCode = escodegen.generate(ast);
  return {
    'ast': ast,
    'refactoredCode': refactoredCode
  };
};

module.exports = {
  'start': start
};
