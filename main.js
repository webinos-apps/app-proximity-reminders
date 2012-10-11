/* All of ProximityReminder's JavaScript */

var places;
var reminders;
var VIEW_DIV_ID = "viewDiv";
var EDIT_DIV_ID = "editDiv";

$(document).ready(function() {

	getAllData(function(data) {
		places = data.places;
		reminders = data.reminders;
		loadApp();	
	},
	function(err) {
	    $("#frontStatus").css("color","red");
	    $("#frontStatus").text("Error connecting to webinos");
		console.log("Error:  " + err);
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
	$("#createReminder").click(function() {
        hideViewPage();
        loadAddPage();
	});
	$("#viewReminders").click(function() {
        hideAddPage();
        loadViewPage();
	});	
}


function hideAddPage() {
    if ($("#"+EDIT_DIV_ID).length > 0) {
        $("#"+EDIT_DIV_ID).hide();
    }
}

function loadAddPage() {
    var addDiv = $("#"+EDIT_DIV_ID);   
    addDiv.show();  
    getEditPage(null);    
}



function hideViewPage() {
    if ($("#"+VIEW_DIV_ID).length > 0) {
        $("#"+VIEW_DIV_ID).hide();
    }
}

function loadViewPage() {
    $("#morecontent").append("<div id='" + VIEW_DIV_ID + "'></div>"); 
    var viewDiv = $("#"+VIEW_DIV_ID);
    getRemindersPage();
    getPlaces();     
    viewDiv.show();  
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

