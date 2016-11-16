var found = false;
var people=["anura","kumara","rusiru","Don","hhh","John"];
for (var i = 0; i < people.length; i++) {
    if (!found) {
        if (people[i]==="Don") {
            console.log("found",people[i]);
            found = true;
        }
        if (people[i]==="John") {
            console.log("found2",people[i]);
            found = true;
        }
    }
}