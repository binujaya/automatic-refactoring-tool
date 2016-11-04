var price = 1000;
var discount = true;
var amount;
var printBill = function (amount) {
    console.log('The total amount is : ', amount);
};
if (discount) {
    amount = price * 0.9;
} else if (amount > 1000) {
    printSum(amount);
} else if (amount < 0) {
    printMass();
} else {
    amount = price;
    printMessage();
}
if (price) {
    console.log(amount);
} else if (price > 0) {
    console.log(amount);
    printRusiru(amount);
} else {
    console.log('amount', amount);
}
printBill(amount);
printBill(amount);