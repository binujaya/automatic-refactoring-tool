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