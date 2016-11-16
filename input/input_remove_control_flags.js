var i = 0; //while
var control = true;
while (control) {
    console.log("*");
    i++;
    if (i == 5) control = false;

}

var i = 0; //do-while
var value = true;
do {
    text += "The number is " + i;
    console.log(text);
    i++;
    if (i == 6) {
        value = false;

    }
}
while (value);


var found = false; //for statement break
var people = ["anura", "kumara", "rusiru", "Don", "hhh", "John"];
for (var i = 0; i < people.length; i++) {
    if (!found) {
        if (people[i] === "Don") {
            console.log("found", people[i]);
            found = true;
        }
        if (people[i] === "John") {
            console.log("found2", people[i]);
            found = true;
        }
    }
}