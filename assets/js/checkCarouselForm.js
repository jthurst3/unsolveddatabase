// modified from http://www.w3schools.com/js/js_form_validation.asp and http://webcheatsheet.com/javascript/form_validation.php#username
function validateCarouselItem() {
	var form = document.forms["carouselInput"];
	// check for blank inputs
	var pNumber = form["number"].value;
	var pPic = form["pic"].value;
	var pURL = form["url"].value;
	var pColor = form["color"].value;
	var pText = form["text"].value;
	var pSubtext = form["subtext"].value;
	if(pNumber == null || pNumber == "") {
		alert("Carousel item must have a number.");
		return false;
	}
	if(pPic == null || pPic == "") {
		alert("Carousel item must have a pic.");
		return false;
	}
	if(pURL == null || pURL == "") {
		alert("Carousel item must have a URL.");
		return false;
	}
	if(pColor == null || pColor == "") {
		alert("Carousel item must have a color.");
		return false;
	}
	if(pText == null || pText == "") {
		alert("Carousel item must have text.");
		return false;
	}
	if(pSubtext == null || pSubtext == "") {
		alert("Carousel item must have subtext.");
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