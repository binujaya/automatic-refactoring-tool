var baseBonusPerc = 0.2;
var holidayBonusPerc = 0.3;

var getBonusPerc = function() {
  return baseBonusPerc + holidayBonusPerc;
}

var getWage = function(allowance) {
  var bonus = allowance * getBonusPerc();
  var wage = allowance + bonus;
  return wage;
}
