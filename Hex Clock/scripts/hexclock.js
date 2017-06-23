function updateClockFace() {
	var dateTime = getDateTime();
	document.body.style.backgroundColor = dateTime;
	document.getElementById("hextime").innerHTML = dateTime;
	setTimeout(updateClockFace, 1000);
}
updateClockFace();

function getDateTime()
{
	var date = new Date();
	return "#" + validateTimeUnits(date.getHours()) +""+ validateTimeUnits(date.getMinutes()) +""+ validateTimeUnits(date.getSeconds());
}

function validateTimeUnits(timeUnits)
{
  return timeUnits = (timeUnits > 9) ? timeUnits : "0" + timeUnits;
}
