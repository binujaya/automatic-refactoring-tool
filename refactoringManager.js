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
  if (options) MethodComposer.removeAssignToParam(ast);
  if (options) MethodComposer.addInlineMethods(ast); // TODO: assignments in if conditions must come one level out of scope
  // ConConsolidateConditional.consolidateConditionalExpression(ast);//conditionalSimplifier
  if (options) MethodComposer.extractVariables(ast);
  // MethodComposer.extractMethods(ast);
  if (options) ConConsolidateDuplicate.removeDuplicates(ast);
  if (options) ConRemoveFlags.replaceFunction(ast);
  if (options) ConReplaceNested.replaceNestedConditionals(ast);
  if (options) parameterizeMethod.searchParameterizeMethods(ast);
  if (options) parameterizeMethod.matchDuplicatemethods(ast);
  if (options) removeParameters.searchRemoveParameter(ast);
  if (options) renameShortNames.searchMethodsName(ast);
  if (options) renamePoorNames.searchMethodsName(ast);

  refactoredCode = escodegen.generate(ast);
  return {
    'ast': ast,
    'refactoredCode': refactoredCode
  };
};

module.exports = {
  'start': start
};
