var seniority = 5;
var monthsDisabled = 11;
var isPartTime = false;


var disabilityAmount = function () {
    if (seniority < 2) return 0;
    if (monthsDisabled > 12) return 0;
    if (isPartTime) return 0;
}

var disabilityAmount = function () {
    if ((seniority < 2) || (monthsDisabled > 12) || (isPartTime))
        return 0;
}