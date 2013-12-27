// modified from http://www.w3schools.com/js/js_form_validation.asp and http://webcheatsheet.com/javascript/form_validation.php#username
function validateForm() {
	var form = document.forms["problemInput"];
	// check for blank inputs
	var pName = form["problemName"].value;
	var pAbbrev = form["problemAbbrev"].value;
	var pTopic = form["topic"].value;
	var pSubtopic = form["subtopic"].value;
	if(pName == null || pName == "") {
		alert("Unsolved problem must have a name.");
		return false;
	}
	if(pAbbrev == null || pAbbrev == "") {
		alert("Unsolved problem must have an abbreviation.");
		return false;
	}
	if(pTopic == null || pTopic == "") {
		alert("Unsolved problem must have a topic.");
		return false;
	}
	if(pSubtopic == null || pSubtopic == "") {
		alert("Unsolved problem must have a subtopic.");
		return false;
	}
	// check for valid characters in abbreviation
	var illegalCharset = /\W/;
	if(illegalCharset.test(pAbbrev)) {
		alert("Unsolved problem must contain only letters, numbers and underscores.");
		return false;
	}
	return true;
}