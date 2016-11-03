var price = 1000.0;
var discount = true;
var amount;

var printBill = function (amount) {
    console.log("The total amount is : ", amount);
};
if (discount) {
    amount = price * 0.90;
    printBill(amount);
} else {
    printBill(amount);       
}


