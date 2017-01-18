var main = function() {
  var bonus = 100;
  bonus=bonus+myFunc();
  bonus*2;
  return myFunc() +bonus;
}

var myFunc = function() {
  return 200;
}

var main2 = function () {
  var index =0;
  a = [0,1,2,3];
  a[index]=myFunc();
  index++;
}
