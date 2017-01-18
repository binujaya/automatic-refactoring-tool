// TODO: thisdoesnt work.. Fix it!!! Scope problem
var getFinalScore = function(roundOneScore, roundTwoScore) {
  if(roundOneScore > 10){
    roundOneScore = roundOneScore + 1;
  }
  if(roundTwoScore > 10){
    roundTwoScore = roundTwoScore + 1;
  }
  return roundOneScore + roundTwoScore;
}
