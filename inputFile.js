var getGrade = function (answer) {
  var result = '';
  if (answer>90){
    result = 'A';
  }
  else if (answer>80){
    result = 'B';
  }
  else if (answer>60) {
    result = 'C';
  }
  else if (answer>40) {
    result = 'D';
  }
  else {
    result = 'F';
  }
  return result;
}

var myGrade = getGrade(42);
