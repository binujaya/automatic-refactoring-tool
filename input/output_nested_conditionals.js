var getPayAmount = function () {
    if (isDead) {
        var k;
        result = deadAmount();
    }
    if (isSeparated) {
        return separatedAmount();
    }
    if (isRetired) {
        return retiredAmount();
    }
    return normalPayAmount();
};
function getGrade(marks) {
    var result;
    if (marks >= 75) {
        var a;
        var k;
        result = 'A';
    }
    if (marks >= 65) {
        var b;
        result = 'B';
    }
    if (marks >= 50) {
        var c;
        result = 'C';
    }
    return 'F';
}