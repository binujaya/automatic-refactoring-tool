//var getPayAmount=function() {
//  var  result;
//  if (isDead){
//    result = deadAmount();
//  }
//  else {
//    if (isSeparated){
//      result = separatedAmount();
//    }
//    else {
//      if (isRetired){
//        result = retiredAmount();
//      }
//      else{
//        result = normalPayAmount();
//      }
//    }
//  }
//  return result;
//}
//var a = 200;
//if (a > 100) {
//    console.log("high");
//
//} else {
//    console.log("low");
//}
var getPayAmount = function () {
if (isDead) {
    result = deadAmount();
} else {
    if (isSeparated) {
        result = separatedAmount();
    } else {
        if (isRetired) {
            result = retiredAmount();
        } else {
            result = normalPayAmount();
        }
    }
}
}
//if(isDead){
//     result = deadAmount();
//}
//else if(isSeparated){
//    result = separatedAmount();
//}
//else{
//    result = normalPayAmount();
//}
//console.log("single ifs");
//var getPayAmount = function () {
//    if (isDead) {
//        return deadAmount();
//    }
//    if (isSeparated) {
//        return separatedAmount();
//    }
//    if (isRetired) {
//        return retiredAmount();
//    }
//    return normalPayAmount();
//}
