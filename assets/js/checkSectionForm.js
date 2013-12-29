// modified from http://www.w3schools.com/js/js_form_validation.asp and http://webcheatsheet.com/javascript/form_validation.php#username
function validateSection() {
	var form = document.forms["sectionInput"];
	// check for blank inputs
	var pName = form["name"].value;
	var pSection = form["section"].value;
	var pSectionName = form["sectionName"].value;
	var pSectionNumber = form["sectionNumber"].value;
	if(pName == null || pName == "") {
		alert("Problem must have an ID.");
		return false;
	}
	if(pSection == null || pSection == "") {
		alert("Section must have an ID.");
		return false;
	}
	if(pSectionName == null || pSectionName == "") {
		alert("Section must have a name.");
		return false;
	}
	if(pSectionNumber == null || pSectionNumber == "") {
		alert("Section must have a number.");
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