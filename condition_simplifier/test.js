var array = [1, 1, 1, 3, 3, 1, 2, 2];



var createNewArrays = function (array) {
    result = [];

    array.forEach(function (a) {
        a in this || result.push(this[a] = []);
        this[a].push(a);
    }, Object.create(null));

    console.log(result);

};