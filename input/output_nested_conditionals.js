var getPayAmount = function () {
    if (isDead) {
        return deadAmount();
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
        return 'A';
    }
    if (marks >= 65) {
        return 'B';
    }
    if (marks >= 50) {
        return 'C';
    }
    return 'F';
}