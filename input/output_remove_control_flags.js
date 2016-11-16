var i = 0;
var control = true;
while (control) {
    console.log('*');
    i++;
    if (i == 5)
        break;
}
var i = 0;
var value = true;
do {
    text += 'The number is ' + i;
    console.log(text);
    i++;
    if (i == 6) {
        break;
    } else {
        value = true;
    }
} while (value);
var found = false;
var people = [
    'anura',
    'kumara',
    'rusiru',
    'Don',
    'hhh',
    'John'
];
for (var i = 0; i < people.length; i++) {
    if (!found) {
        if (people[i] === 'Don') {
            console.log('found', people[i]);
            break;
        }
        if (people[i] === 'John') {
            console.log('found2', people[i]);
            break;
        }
    }
}