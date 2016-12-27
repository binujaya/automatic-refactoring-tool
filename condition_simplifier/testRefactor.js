function getStudentDetails() {
    var name = 'akila';
    var marks = 80;
    var income = 5000;
    var indexNo = getIndexNumber(name);
    var marks = getGrade(marks);
    var fees = calculateFees(income);
    printValues(indexNo, marks, fees);
}
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
function calculateFees(amount) {
    var total;
    if (amount > 2000) {
        total = amount * 0.9;
    } else {
        total = amount * 0.98;
    }
    printTotal(total);
    return total;
}
function getIndexNumber(name) {
    var found = false;
    var index;
    var people = [
        'anura',
        'akila',
        'rusiru',
        'John'
    ];
    for (var i = 0; i < people.length; i++) {
        if (!found) {
            if (people[i] === name) {
                index = i;
                break;
            }
        }
    }
    return index;
}
function printTotal(total) {
    console.log(total);
}
function printValues(indexNo, marks, fees) {
    console.log(indexNo, marks, fees);
}
getStudentDetails();