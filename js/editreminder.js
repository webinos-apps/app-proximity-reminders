/* edit reminder */


function getEditPage(reminderId) {
    changeHeading(reminderId);
    getEditFields(reminderId);  
}


function changeHeading(reminderId) {
    var heading = $('#editHeading');
    if (reminderId === null) {
        heading.text("Add Reminder");
    } else {
        heading.text("Edit Reminder");    
    }
}

function saveReminder() {   
    alert("Submit!");
}

function dateTimeSelect() {
    if ($("#dateSelect").val() === 'Select a time') {
        $("#dateWrapper").show();
    } else {   
        $('#dateWrapper').hide();            
    }
}

function mapLoadedCallback() {

    geoGetCurrentPosition(function(position) {
        var currentLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        displayEditMap(currentLocation);
    }, function(err) {
        var currentLocation = new google.maps.LatLng(-33.8665433,151.1956316);
        displayEditMap(currentLocation);
    });

}

function loadEditGoogleMap() {
    loadGoogleMapsScript("mapLoadedCallback");
}

function displayEditMap(position) {
    console.log("Displating map at position " + JSON.stringify(position));
    var map;
    map = new google.maps.Map(document.getElementById('editPlaceLocationSelect'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: position,
        zoom: 12
    });
    
}


function placeSelect() {
    if ($("#placeSelect").val() === '_ANYWHERE') {
        $("#placeAddRow1").hide();
        $("#placeAddRow2").hide();        
    } else if ($("#placeSelect").val() === '_NEWPLACE') {
        $("#editPlaceDescription").val("");
        $("#editPlaceLocationSelect").html("");
        
        loadEditGoogleMap();
        
        $("#placeAddRow1").show();
        $("#placeAddRow2").show();       
    } else {
        var place = places[$("#placeSelect").val()];
        if (place != null) {
            $("#editPlaceDescription").val(place.description);
            $("#editPlaceLocationSelect").html(getGoogleMap(place.coordinates));
        }
        $("#placeAddRow1").show();
        $("#placeAddRow2").show();       
    }
}

function showProximityField(reminder) {
    //HACK: Currently only works for single places.
    $('#proximityDiv').show();
    if (reminder === null || 
        reminder.where === null || 
        reminder.where[0] === null ||
        reminder.where[0].proximity === null || 
        reminder.where[0].proximity.amount === null
        ) {
        $('#proximityAmount').val("10");
    } else {
        $('#proximityAmount').val(reminder.where[0].proximity.amount);
    }
}



function getEditFields(reminderId) {

    var editTable = $("#editTable");

    $("#datepicker").datetimepicker({
        controlType: 'select',
	    ampm: true
    });

    $("#dateSelect").change(dateTimeSelect);

//    $("#placeSelect").append("<option value=\"_ANYWHERE\" selected="true" id=\"place-option-_ANYWHERE\">Anywhere</option>")
    for (var p in places) {
        var placeOption = $("<option value='" +  places[p].id + "' id='placeoption-" + places[p].id + "'>" + places[p].description + "</option>");
        $("#placeSelect").append(placeOption);
    }
    
    $("#placeSelect").append("<option value=\"_NEWPLACE\" id=\"place-option-_NEWPLACE\">Add a new location</option>");

    $("#placeSelect").change(placeSelect);

    $("#saveReminderButton").click(saveReminder);
    
}




