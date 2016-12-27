var price = 1000;
var discount = true;
var amount;
var printBill = function (amount) {
    console.log('The total amount is : ', amount);
};
var printSum = function (amount) {
    console.log('The sum is', price + amount);
};
if (discount) {
    amount = price * 0.9;
} else if (amount > 1000) {
} else if (amount < 0) {
    printMass();
} else {
    amount = price;
    printMessage();
}
printBill(amount);
printSum(amount);
console.log('In the middle of body');
if (price) {
} else if (price > 0) {
    printRusiru(amount);
} else {
}
printBill(amount);
console.log(amount);
if (amount > 1000) {
    printBill(amount);
} else {
}
printHash();
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