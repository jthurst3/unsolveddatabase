// modified from http://www.w3schools.com/js/js_form_validation.asp and http://webcheatsheet.com/javascript/form_validation.php#username
function validateField() {
	var form = document.forms["fieldInput"];
	// check for blank inputs
	var name = form["name"].value;
	var nid = form["nid"].value;
	var currentField = form["currentField"].value;
	if(name == null || name == "") {
		alert("Category must have a name.");
		return false;
	}
	if(nid == null || nid == "") {
		alert("Category must have an ID.");
		return false;
	}
	if(currentField == null || currentField == "") {
		alert("Category must have a current field.");
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