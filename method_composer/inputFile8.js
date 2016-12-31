var multiplierParam = 0.02;
var getBonusScore = function (score1, score2, score3, score3, score4) {
  var bonusScore;
  if (score1 + score2 >30 && score2 * score3 < 1000 || score3 - score4 > 10) {
    if (score1 + score2 + score3 > 50) {
      score1 = score1 + 1;
      bonusScore = (score1 + score2 + score3)/10*getMultiplier();
    }
    else {
      bonusScore = (score1*2 + score2*3)/10*getMultiplier();
    }
  }
  else {
    bonusScore = (score1 * 2)/10;
  }
  return bonusScore;
}

var getMultiplier = function () {
  return multiplierParam*100;
}
