

var price=1000.0;

var discount = true;
printBill=function(){
    console.log("The total bill is :",amount);
}



if (discount) {
  amount = price * 0.90;
  printBill();
}
else {
  amount = price;
  printBill();
}

