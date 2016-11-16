var i = 0;
var control = true;
while (control) {
    console.log("*");
    i++;
    
    if (i == 5) control = false;
}


//var i = 0;
//var control = true;
//while (true) {
//    console.log("*");
//    i++;
//    if (i == 5) control = false;
//


var i = 0;
var value=true;
do {
    text += "The number is " + i;
    console.log(text);
    i++;
    if(i==6){
    value=false;   
        
    }
}
while (value);