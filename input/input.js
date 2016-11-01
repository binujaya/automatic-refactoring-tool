var price = 1000.0;
var discount = true;
var amount;

var printBill = function (amount) {
    console.log("The total amount is : ", amount);
}

function printMessage(){
    console.log("Thank you come again");
}

if (discount) {
    amount = price * 0.90;
    printBill(amount);
    console.log("abc");
    printMessage();
    
    
} else {
    amount = price;
    printBill(amount);
    console.log("cde");
    console.log("abc");
    printMessage();
}

