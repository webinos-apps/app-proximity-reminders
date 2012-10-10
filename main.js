/* All of ProximityReminder's JavaScript */

var places;
var reminders;

$(document).ready(function() {

	getAllData(function(data) {
		places = data.places;
		reminders = data.reminders;
		loadApp();	
	},
	function(err) {
		console.log("Error!!!! " + err);
	});

	


});

function makeEnabled() {	
	$("#viewReminders").attr('disabled', false);
	$("#createReminder").attr('disabled', false);
	$("#frontStatus").css("color","black");
	$("#frontStatus").text("Connected to webinos");
}


function loadApp() {
	makeEnabled();
	$("#viewReminders").click(function() {
		showRemindersPage();
		showPlaces();
		$("#frontpage").append("<div id='map'></div>");
	});
}


function showRemindersPage() {
	
	var table = $('<table></table>').addClass("reminderTable");
	var headerRow = $('<tr><th>Description</th><th>When?</th><th>Where?</th></tr>');
	table.append(headerRow);
    for (var i=0; i<reminders.length; i++) {
	     var row = showReminderRow(reminders[i]);
		 table.append(row);
	}	
	var heading = $('<h1></h1>').text("Reminders");

	$("#frontpage").append(heading);
	$("#frontpage").append(table);
}	

function highlightPlace() {
	var id = $(this).attr("id");
	id = id.substring(id.indexOf("-")+1, id.length);
	console.log( id );	
	showMapId(id);

}

function showReminderRow(reminder) {
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
		where.append(createWhereLink(reminder.where[i]));
		where.append(" (within " + reminder.where[i].proximity.amount + " " +  
		reminder.where[i].proximity.units + ") <br/>");
	}
	
	row.append(desc);
	row.append(when); 
	row.append(where);
	return row;
}


function createWhereLink(whereObject) {
	var whereLink = $('<a></a>');
	whereLink.attr('id', "linkto-" + whereObject.place.id);
	whereLink.attr('href', "#" + whereObject.place.id);
	whereLink.addClass("whereLink");
	whereLink.click(highlightPlace);
	whereLink.text(whereObject.place.description);
	return whereLink;
}

function showPlaces() {

	var list = $('<ul></ul>');
	list.addClass('placeList');

    for (var i=0; i<places.length; i++) {
		var placeItem = $('<li></li>');
		var placeLink = $('<a></a>');
		placeLink.text(places[i].description);
		placeLink.attr('id', "" + places[i].id);
		placeLink.attr('href', "#" + places[i].id);
		placeLink.click(showMap);
		placeItem.append(placeLink);
		list.append(placeItem);
	}	
	var heading = $('<h1></h1>').text("Places");


	$("#frontpage").append(heading);
	$("#frontpage").append(list);

}

function showMapId(id) {
	for (var i=0;i<places.length;i++) {		
		if (places[i].id === id) {
			console.log("Found the place: " + places[i].id + " - " + places[i].description);			
			$('#map').html(getGoogleMap(places[i].coordinates));
			$('#' + id).addClass("selectedPlace");
		} else {
			console.log("Not the place: " + places[i].id + " - " + places[i].description);
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
			"&zoom=14&size=400x400&sensor=false"
	var gMap = $("<img />");
	gMap.attr("src", image_url).attr('id','imgmap');
	return gMap;
}


/* JSON object describing a reminder:

 { 
   description : "pick up the milk",
   when        : [{  
   	date      : new Date("October 13, 2013 11:13:00"),
        recurring : "daily / weekly / monthly / yearly"
   }], 
   where       : [{
	place 	  : placeid,
        proximity  : {
		amount : 10
		units  : "metres / miles / yards / feet"
	}
   }]
*/


/* JSON object describing a place:

{
  id          : "47",
  datecreated : new Date("October 13, 2013 11:13:00"),
  description : "supermarket",
  coordinates : {
	latitude : double,
	longitude : double,
	altitude : double
  }
}
*/

