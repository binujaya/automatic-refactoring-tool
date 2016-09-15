var price = 1000.0;
var discount = true;

var printMessage = function () {
    console.log("Thank you come again");
}

if (discount) {
    amount = price * 0.90;
    printMessage()
} else {
    amount = price;
    printMessage();

}