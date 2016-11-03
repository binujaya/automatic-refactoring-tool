var price = 1000.0;
var discount = true;
var amount;

var printBill = function (amount) {
    console.log("The total amount is : ", amount);
}



if (discount) {
    amount = price * 0.90;
    printBill(amount);

} else if (amount > 1000) {
    printBill(amount);
    printSum(amount);
} else if (amount < 0) {
    printMass();
    printBill(amount);
} else {
    amount = price;
    printMessage();
    printBill(amount);

}

if (price) {
    console.log(amount);
    printBill(amount);
} else if (price > 0) {
    console.log(amount);
    printRusiru(amount);
    printBill(amount);
} else {
    printBill(amount);
    console.log("amount",amount);
}