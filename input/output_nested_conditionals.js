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
var marks = 80;
var getGrade = function () {
    if (Marks >= 75) {
        return 'A';
    }
    if (Marks >= 65) {
        return 'B';
    }
    if (Marks >= 50) {
        return 'C';
    }
    return 'F';
};