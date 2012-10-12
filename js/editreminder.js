/* This file uses globals.  Read the globals.js to check which ones */

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

function createAddObjects() {
    var add = {
        isNew : ($('#editHeading').text() === "Add Reminder"),
        reminder : {},
        place : null
    };
    add.place = getEditPlace();    
    add.reminder.description = $('#editDescription').val();
    add.reminder.when = [];
    add.reminder.when.push(getEditWhen());
    add.reminder.where = [];
    add.reminder.where.push(getEditWhere(add.place));
    return add;
}

function getEditPlace() {
    var place;
    if ($('#placeSelect').val() !== "_ANYWHERE") {
        place = {};
        if ($('#placeSelect').val() === '_NEWPLACE') {
            place.id = getNewPlaceId();
            place.datecreated = new Date();
            place.description = $('#editPlaceDescription').val();    
            var latlng = editMap.getCenter();
            place.coordinates = {
                latitude  : latlng.lat(),
                longitude : latlng.lng()
            };
            return place;
        } else {
            return places[$('#placeSelect').val()];
        }
    } else {
        return null;
    }
}

function getNewPlaceId() {
    return "place-" + Date.now();
}


function getEditWhere(place) {
    //pre: given a place with a valid id.
    if (place === null) {
        return "anywhere";
    } else {
        return {
            "place" : place.id,
            "proximity" : {
                amount : $('#proximityAmount').val(),
                units : $('#proximityUnits').val()
            }
        }
    }
}

function getEditWhen() {
    if ($("#dateSelect").val() === 'selecttime') {
        var dateSelected = $("#datepicker").datepicker( "getDate" )
        var recurr = $('#recurringSelect').val();
        return { date : dateSelected, recurring : recurr };
    } else {
        return "anytime";
    }
}

function isPlace(place) {
    return !(place === null || place === "anywhere");
}

function saveEditReminder() {   
    var add = createAddObjects();
    //TODO: Sanity check input.
    
    console.log("Adding: " + JSON.stringify(add));
    
    savePlace(add.place, function() {  
        if (isPlace(add.place)) {
            places[add.place.id] = add.place;  
            console.log("Added " + add.place.id);            
        } 
        saveReminder(add.reminder, function() {
            if (add.isNew) {
                reminders.push(add.reminder);
                alert("Successfull saved reminder: " + add.reminder.description);
            } else {
                //TODO ?
            }
        }, function(err) {
            alert("Failed to add reminder: " + add.reminder.description);
        });
    }, function(err) {
        alert("Failed to add place: " + add.place.description);
    });
}

function dateTimeSelect() {
    if ($("#dateSelect").val() === 'selecttime') {
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
    editMap = new google.maps.Map(document.getElementById('editPlaceLocationSelect'), {
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
        
        showProximityField();
        
        $("#placeAddRow1").show();
        $("#placeAddRow2").show();       
    } else {
        var place = places[$("#placeSelect").val()];
        if (place != null) {
            $("#editPlaceDescription").val(place.description);
            $("#editPlaceLocationSelect").html(getGoogleMap(place.coordinates));
        }
        
        showProximityField();
        
        $("#placeAddRow1").show();
        $("#placeAddRow2").show();       
    }
}

function showProximityField(reminder) {
    //HACK: Currently only works for single places.
    $('#proximityDiv').show();
    if (reminder == undefined || 
        reminder.where == undefined || 
        reminder.where[0] == undefined ||
        reminder.where[0].proximity == undefined || 
        reminder.where[0].proximity.amount == undefined
        ) {
        $('#proximityAmount').val("10");
    } else {
        $('#proximityAmount').val(reminder.where[0].proximity.amount);
        $('#proximityUnits').val(reminder.where[0].proximity.units);
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

    $("#saveReminderButton").click(saveEditReminder);
    
}




