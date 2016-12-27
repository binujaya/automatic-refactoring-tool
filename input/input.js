var price = 1000.0;
var discount = true;
var amount;

var printBill = function (amount) {
    console.log("The total amount is : ", amount);
}
 
var printSum=function(amount){
    console.log("The sum is",price+amount);
}


if (discount) {
    amount = price * 0.90;
    printBill(amount);
    printSum(amount);

} else if (amount > 1000) {
    printBill(amount);
    printSum(amount);
} else if (amount < 0) {
    printMass();
    printBill(amount);
    printSum(amount);
} else {
    amount = price;
    printMessage();
    printBill(amount);
    printSum(amount);

}
console.log("In the middle of body");
if (price) {
    console.log(amount);
    printBill(amount);
} else if (price > 0) {
    console.log(amount);
    printRusiru(amount);
    printBill(amount);
} else {
    printBill(amount);
    console.log(amount);
}
if(amount >1000){
    printHash();
    printBill(amount);
} 
else{
   printHash(); 
}

function calculateFees(amount) {
    var total;
    if (amount > 2000) {
        total = amount * 0.9;
        printTotal(total);
    } else {
        total = amount * 0.98;
        printTotal(total);
    }
    return total;
}