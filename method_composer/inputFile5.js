var getBonusScore = function (score1, score2, score3, score3, score4) {
  var bonusScore;
  if (score1 + score2 >30 && score2 * score3 < 1000 || score3 - score4 > 10) {
    if (score1 + score2 + score3 > 50) {
      bonusScore = (score1 + score2 + score3)/10*2;
    }
    else {
      bonusScore = (score1*2 + score2*3)/10*2;
    }
  }
  else {
    bonusScore = (score1 * 2)/10;
  }
  return bonusScore;
}
