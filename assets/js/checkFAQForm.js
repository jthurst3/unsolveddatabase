// modified from http://www.w3schools.com/js/js_form_validation.asp and http://webcheatsheet.com/javascript/form_validation.php#username
function validateFAQ() {
	var form = document.forms["faqInput"];
	// check for blank inputs
	var pNumber = form["number"].value;
	var pQuestion = form["question"].value;
	var pAnswer = form["answer"].value;
	if(pNumber == null || pNumber == "") {
		alert("FAQ must have a number.");
		return false;
	}
	if(pQuestion == null || pQuestion == "") {
		alert("FAQ must have a question.");
		return false;
	}
	if(pAnswer == null || pAnswer == "") {
		alert("FAQ must have an answer.");
		return false;
	}
	// check for valid characters in abbreviation
	/*var illegalCharset = /\W/;
	if(illegalCharset.test(pAbbrev)) {
		alert("Unsolved problem must contain only letters, numbers and underscores.");
		return false;
	}*/
	return true;
}