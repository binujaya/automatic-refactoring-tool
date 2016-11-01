var price = 1000;
var discount = true;
var amount;
var printBill = function (amount) {
    console.log('The total amount is : ', amount);
};
function printMessage() {
    console.log('Thank you come again');
}
if (discount) {
    amount = price * 0.9;
} else {
    amount = price;
    console.log('cde');
}
printBill(amount);
console.log('abc');
printMessage();