/* This file uses globals.  Read the globals.js to check which ones */

function getEditPage(reminder) {
    changeHeading(reminder);
    setEditFields(reminder);
}


function changeHeading(reminder) {
    var heading = $('#editHeading');
    if (reminder === undefined) {
        heading.text("Add Reminder");
    } else {
        heading.text("Edit Reminder");
        $('#reminderIdCell').text(reminder.id);
    }
}

function createAddObjects() {
    var add = {
        isNew: ($('#editHeading').text() === "Add Reminder"),
        isNewPlace: ($('#placeSelect').val() === '_NEWPLACE'),
        reminder: {},
        place: null
    };
    add.place = getEditPlace();
    if (add.isNew) {
        add.reminder.id = createReminderId();
    } else {
        add.reminder.id = $('#reminderIdCell').text();
    }

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
                latitude: latlng.lat(),
                longitude: latlng.lng()
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
            "place": place.id,
            "proximity": {
                amount: $('#proximityAmount').val(),
                units: $('#proximityUnits').val()
            }
        };
    }
}

function getEditWhen() {
    if ($("#dateSelect").val() !== 'anytime') {
        var dateSelected = $("#datepicker").datepicker("getDate");
        var recurr = $('#recurringSelect').val();
        return {
            date: dateSelected,
            recurring: recurr
        };
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

    savePlace(add.place, function () {
        if (isPlace(add.place)) {
            places[add.place.id] = add.place;
            console.log("Added " + add.place.id);
        }
        saveReminder(add.reminder, function () {
            if (add.isNew) {
                reminders[add.reminder.id] = add.reminder;
                if (isPlace(add.place)) {
                    add.reminder.where[0].place = places[add.place.id];
                }
                alert("New reminder saved: " + add.reminder.description);
            } else {
                reminders[add.reminder.id] = add.reminder;
                if (add.isNewPlace) {
                    places[add.place.id] = add.place;
                }
                alert("Reminder saved: " + add.reminder.description);
            }
            hideAddPage();
            loadViewPage();
        }, function (err) {
            alert("Failed to add reminder: " + add.reminder.description);
        });
    }, function (err) {
        alert("Failed to add place: " + add.place.description);
    });
}

function dateTimeSelect() {
    console.log($("#dateSelect").val());
    if ($("#dateSelect").val() !== 'anytime') {
        $("#dateWrapper").show();
    } else {
        $('#dateWrapper').hide();
    }
}

function mapLoadedCallback() {

    geoGetCurrentPosition(function (position) {
        var currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        displayEditMap(currentLocation, 'editPlaceLocationSelect');
    }, function (err) {
        var currentLocation = new google.maps.LatLng(-33.8665433, 151.1956316);
        displayEditMap(currentLocation, 'editPlaceLocationSelect');
    });

}

function loadEditGoogleMap() {
    loadGoogleMapsScript("mapLoadedCallback");
}

function displayEditMap(position, element) {
    console.log("Displaying map at position " + JSON.stringify(position));
    editMap = new google.maps.Map(document.getElementById(element), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: position,
        zoom: 12
    });
}


function placeSelect(reminder) {
    if ($("#placeSelect").val() === '_ANYWHERE') {
        $("#placeAddRow1").hide();
        $("#placeAddRow2").hide();
        hideProximityField();
    } else if ($("#placeSelect").val() === '_NEWPLACE') {
        $("#editPlaceDescription").val("");
        $("#editPlaceLocationSelect").html("");

        loadEditGoogleMap();

        showProximityField();

        $("#placeAddRow1").show();
        $("#placeAddRow2").show();
    } else {
        var place = places[$("#placeSelect").val()];
        if (place !== null) {
            $("#editPlaceDescription").val(place.description);
            $("#editPlaceLocationSelect").html(getGoogleMap(place.coordinates));
        }

        showProximityField(reminder);

        $("#placeAddRow1").show();
        $("#placeAddRow2").show();
    }
}

function hideProximityField() {
    $('#proximityDiv').hide();
}

function showProximityField(reminder) {
    //HACK: Currently only works for single places.
    $('#proximityDiv').show();
    if (reminder === undefined || reminder.where === undefined || reminder.where[0] === undefined || reminder.where[0].proximity === undefined || reminder.where[0].proximity.amount === undefined) {
        $('#proximityAmount').val("10");
    } else {
        $('#proximityAmount').val(reminder.where[0].proximity.amount);
        $('#proximityUnits').val(reminder.where[0].proximity.units);
    }
}



function setEditFields(reminder) {
    setEditDescription(reminder);
    setEditDateFields(reminder);
    setEditPlaceFields(reminder);
    $("#saveReminderButton").click(saveEditReminder);
}

function setEditDescription(reminder) {
    if (reminder !== undefined && reminder.description !== undefined) {
        $("#editDescription").val(reminder.description);
    } else {
        $("#editDescription").val("");
    }
}

function setEditPlaceFields(reminder) {
    //remove all places
    $("#placeSelect option").filter(function () {
        return ($(this).attr("class") !== "persistentOption");
    }).remove();

    //add all places again
    for (var p in places) {
        var placeOption = $("<option value='" + places[p].id + "' id='place-option-" + places[p].id + "'>" + places[p].description + "</option>");
        $("#placeSelect").append(placeOption);
    }

    //add the 'new' option
    $("#placeSelect").append("<option value=\"_NEWPLACE\" id=\"place-option-_NEWPLACE\">Add a new location</option>");

    $("#placeSelect").change(placeSelect);

    if (reminder !== undefined && reminder.where !== null && reminder.where[0] !== null && reminder.where[0].place !== undefined) {
        $("#place-option-" + reminder.where[0].place.id).attr('selected', true);
        $("#place-option-" + reminder.where[0].place.id).selected = true;
        $("#placeSelect").val(reminder.where[0].place.id);
        if (reminder.where[0].proximity !== undefined) {
            $('#proximityAmount').val(reminder.where[0].proximity.amount);
            $('#proximityUnits').val(reminder.where[0].proximity.units);
        }
        placeSelect();
    } else {
        $("#placeSelect").val("place-option-_ANYWHERE");
        $('#editPlaceDescription').val("anytime");
        $('#editPlaceLocationSelect').empty();
        $('#proximityAmount').val("10");
        $('#proximityUnits').val("metres");
        placeSelect();
    }
}


function setEditDateFields(reminder) {
    //clear the select options
    $("#dateSelect option").filter(function () {
        return ($(this).attr("class") !== "persistentOption");
    }).remove();


    //Remove a date picker


    var dtOptions = {
        controlType: 'select',
        ampm: true
    };

    if (reminder !== undefined) {
        if (reminder.when !== null && reminder.when[0] !== null && reminder.when[0].date !== undefined) {
            var currOption = $("<option id='_DATE_CURRENT' value='_DATE_CURRENT'>" + reminder.when[0].date.toString() + "</option>");
            currOption.attr('selected', true);
            $("#dateSelect").append(currOption);
            $("#dateSelect").val(reminder.when[0].date.toString());
            $("#_DATE_CURRENT").attr('selected', true);

            $("#datepicker").datetimepicker(dtOptions);
            $("#datepicker").datetimepicker("setDate", reminder.when[0].date);

            if (reminder.when[0].recurring !== null) {
                $("#recurringSelect").val(reminder.when[0].recurring);
                $("#recurringOption-" + reminder.when[0].recurring).attr('selected', true);
                $("#recurringOption-" + reminder.when[0].recurring).selected = true;
                $("#dateWrapper").show();
            }
            dateTimeSelect();
        } else {
            $("#recurringSelect option:selected").attr("selected", false);
            $("#datepicker").datetimepicker(dtOptions);
            //$("#datepicker").datetimepicker("setDate", Date.now());
            dateTimeSelect();
        }
    } else {
        //create a date picker
        $("#datepicker").datetimepicker(dtOptions);
        //$("#datepicker").datetimepicker("setDate", Date.now());
        //set the recurrance back to normal
        $("#recurringSelect option:selected").attr("selected", false);
        $("#recurringSelect").val("");
        dateTimeSelect();
    }


    $("#dateSelect").change(dateTimeSelect);
}
