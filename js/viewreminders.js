/* This file uses globals.  Read the globals.js to check which ones */

function getRemindersPage() {
	var table = $('#viewTable');
	table.empty();
    for (var i=0; i<reminders.length; i++) {
	     var row = getReminderRow(reminders[i]);
         console.log("Should be appending " + JSON.stringify(row) + " to the table");
		 table.append(row);
	}	
}	

function highlightPlace() {
	var id = $(this).attr("id");
	id = id.substring(id.indexOf("-")+1, id.length);
	showMapId(id);
}

function getReminderRow(reminder) {
	console.log("Displaying " + JSON.stringify(reminder));

	var row   = $('<tr></tr>');
	var desc  = $('<td></td>').text(reminder.description);
	var when  = $('<td></td>');	
	for (var i=0;i<when.length;i++) {
		when.append(reminder.when[i].date + ", Recurrance: " + 
			reminder.when[i].recurring + "<br />");
	}
	var where = $('<td></td>')	
	for (var i=0;i<where.length;i++) {
		where.append(getWhereLink(reminder.where[i]));
		where.append(" (within " + reminder.where[i].proximity.amount + " " +  
		reminder.where[i].proximity.units + ") <br/>");
	}
	
	row.append(desc);
	row.append(when); 
	row.append(where);
	return row;
}


function getWhereLink(whereObject) {
	var whereLink = $('<a></a>');
	whereLink.attr('id', "linkto-" + whereObject.place.id);
	whereLink.attr('href', "#" + whereObject.place.id);
	whereLink.addClass("whereLink");
	whereLink.click(highlightPlace);
	whereLink.text(whereObject.place.description);
	return whereLink;
}

function getPlaces() {

	var list = $('#placeUL');
	list.empty();

    for (var p in places) {
		var placeItem = $('<li></li>');
		var placeLink = $('<a></a>');
		placeLink.text(places[p].description);
		placeLink.attr('id', "" + places[p].id);
		placeLink.attr('href', "#" + places[p].id);
		placeLink.click(showMap);
		placeItem.append(placeLink);
		list.append(placeItem);
	}	

	return list;
}

function showMapId(id) {
	for (var p in places) {		
		if (places[p].id === id) {
			$('#map').html(getGoogleMap(places[p].coordinates));
			$('#' + id).addClass("selectedPlace");
		} else {
			$('#' + id).removeClass("selectedPlace");
		}
	}
}

function showMap() {
	var id = $(this).attr("id");
	showMapId(id);
}

function getGoogleMap(coords) {
	var image_url = "http://maps.googleapis.com/maps/api/staticmap?" + 
			"center=" + 
			coords.latitude + "," +
            coords.longitude + 
			"&zoom=12&size=400x400&sensor=false" +
			"&markers=color:blue|label:S|" +
            coords.latitude + ',' + coords.longitude;
	var gMap = $("<img />");
	gMap.attr("src", image_url).attr('id',MAP_IMG_ID);
	return gMap;
}
