
var getPayAmount = function () {//nested if
if (isDead) {
    var k;
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

//var getPay = function () {//single ifs
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
//var a=20;//single if-else
//if(a>20){
//    console.log("high");
//}
//else{
//    console.log("low"); 
//}
//
//if (discount) {//if-elseif-else
//    amount = price * 0.90;
//    printBill(amount);
//    printSum(amount);
//
//} else if (amount > 1000) {
//    printBill(amount);
//    printSum(amount);
//} else if (amount < 0) {
//    printMass();
//    printBill(amount);
//    printSum(amount);
//} else {
//    amount = price;
//    printMessage();
//    printBill(amount);
//    printSum(amount);
//
//}
function getGrade(marks) {
    var result;
    if (marks >= 75) {
        var a;
        var k;
        result = 'A';
    } else {
        if (marks >= 65) {
            var b;
            result = 'B';
        } else {
            if (marks >= 50) {
                var c;
                result = 'C';
            } else {
                var n;
                result = 'F';
            }
        }
    }
    return result;
}