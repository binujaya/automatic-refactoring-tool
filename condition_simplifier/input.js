var price = 1000.0;
var discount = true;
var amount;

var printBill = function (amount) {
    console.log("The total amount is : ", amount);
}

var printMessage = function () {
    console.log("Thank you come again");
}

if (discount) {
    amount = price * 0.90;
    printBill(amount);
    printMessage();
    printSum();
} else {
    amount = price;
    printBill(amount);
    printMessage();

}