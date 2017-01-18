
function getSal(){
	var val = document.getElementById("salary");
	return val;
}

function b(){
	var sal = getSal();
	var bonus;
	if (sal>100000){
		bonus = sal * 0.75;
	}
	else{
		bonus = sal * 0.5;
	}
	return bonus;
}

function get_tot(){
	var sal = getSal();
	var bonus = bonus();
	var totSal = sal + bonus;
	
	return totSal;
}