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


function showReminderRow(reminder) {
	console.log("Displaying " + JSON.stringify(reminder));

	var row   = $('<tr></tr>');
	var desc  = $('<td></td>').text(reminder.description);
	var when  = $('<td></td>');	
	for (var i=0;i<when.length;i++) {
		when.append(reminder.when[i].date + ", Recurrance: " + reminder.when[i].recurring + "<br />");
	}
	var where = $('<td></td>')	
	for (var i=0;i<where.length;i++) {

		where.append("<a href=''>" + reminder.where[i].place.description + 
			"</a> (within " + reminder.where[i].proximity.amount + " " +  
			reminder.where[i].proximity.units + ") <br/>");
//		where.text(JSON.stringify(reminder.where[i].plac));
	}
	
	row.append(desc);
	row.append(when); 
	row.append(where);
	return row;
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

