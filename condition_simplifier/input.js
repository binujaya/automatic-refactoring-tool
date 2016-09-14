var price = 1000.0;
var discount = true;
var printBill = function () {
    console.log("The total bill is :", amount);
}
if (discount) {
    amount = price * 0.90;
    printCash();
    printSum();
    printBill();
} else {
    amount = price;
    printSum();
    printBill();
}