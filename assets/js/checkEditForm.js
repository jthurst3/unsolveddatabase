// modified from http://www.w3schools.com/js/js_form_validation.asp and http://webcheatsheet.com/javascript/form_validation.php#username
function validateEdit(formName) {
	var form = document.forms[formName];
	// check for blank inputs
	var pID = form["problemId"].value;
	var pOldSection = form["problemOldSection"].value;
	var pSection = form["problemSection"].value;
	var pName = form["sectionName"].value;
	var pOldText = form["problemOldText"].value;
	var pNewText = form["problemNewText"].value;
	var values = [pID, pOldSection, pSection, pName, pOldText, pNewText];
	var valueNames = ["Problem ID", "Old section ID", "New Section ID", "Section Name", "Old Text", "New Text"];
	for(var i = 0; i < values.length; i++) {
		if(values[i] == null || values[i] == "") {
			alert = true;
			alertType="alert-error";
			alertText="Value of " + valueNames[i] + " must not be blank.";
			return false;
		}
	}
	// check for valid characters in abbreviation
	/*var illegalCharset = /\W/;
	if(illegalCharset.test(pAbbrev)) {
		alert("Unsolved problem must contain only letters, numbers and underscores.");
		return false;
	}*/
	return true;
}