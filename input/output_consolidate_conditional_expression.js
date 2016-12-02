var seniority = 5;
var monthsDisabled = 11;
var isPartTime = false;
var disabilityAmount = function () {
    if (isLogical)
        return 2;
    if (seniority < 2 || monthsDisabled > 12 || isPartTime || isMature)
        return 0;
    if (isNatural || isNotFunctional)
        return 1;
};
var disabilityAmount = function () {
    if (seniority < 2 || monthsDisabled > 12 || isPartTime)
        return 0;
};