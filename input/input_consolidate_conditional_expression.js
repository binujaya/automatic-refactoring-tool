var seniority = 5;
var monthsDisabled = 11;
var isPartTime = false;


var disabilityAmount = function () {
    if (seniority < 2) return 0;
    if (monthsDisabled > 12) return 0;
    if (isNatural) return 1;
    if (isPartTime) return 0;
    if (isMature) return 0;
    if (isLogical) return 2;
    if (isNotFunctional) return 1;
}

var disabilityAmount = function () {
    if ((seniority < 2) || (monthsDisabled > 12) || (isPartTime))
        return 0;
}