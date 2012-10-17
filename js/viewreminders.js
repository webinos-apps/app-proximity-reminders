/* This file uses globals.  Read the globals.js to check which ones */

function getRemindersPage() {
    var table = $('#viewTable');
    table.empty();
    table.append(getReminderHeaderRow());
    for (var r in reminders) {
        var row = getReminderRow(reminders[r]);
        console.log("Should be appending " + JSON.stringify(row) + " to the table");
        table.append(row);
    }
}

function getReminderHeaderRow() {
    return $("<tr>" + 
                "<th>Description</th>" + 
                "<th>Start time</th>" + 
                "<th>Start date</th>" + 
                "<th>End time</th>" + 
                "<th>End date</th>" + 
                "<th>Recurring?</th>" + 
                "<th>Where?</th>" + 
                "<th>Enabled</th>" + 
                "<th></th>" + 
                "<th></th>" + 
             "</tr>");
}

function highlightPlace() {
    var id = $(this).attr("id");
    id = id.substring(id.indexOf("-") + 1, id.length);
    showMapId(id);
}

function getReminderRow(reminder) {
    console.log("Displaying " + JSON.stringify(reminder));

    var row = $('<tr></tr>');
    var desc = $('<td></td>').text(reminder.description);
    var whenStartTime = $('<td></td>');
    var whenStartDate = $('<td></td>');
    var whenEndTime = $('<td></td>');
    var whenEndDate = $('<td></td>');
    
    var whenRecurring = $('<td></td>');
    if (reminder.when !== undefined && reminder.when !== "anytime" && reminder.when.startdate !== undefined && reminder.when.enddate !== undefined) {
        whenStartTime.append(reminder.when.startdate.toLocaleTimeString());
        whenStartDate.append(reminder.when.startdate.toLocaleDateString());
        whenEndTime.append(reminder.when.enddate.toLocaleTimeString());
        whenEndDate.append(reminder.when.enddate.toLocaleDateString());
        whenRecurring.append(reminder.when.recurring);
    } else {
        whenStartTime.append("Any time");
        whenStartDate.append("");
        whenEndTime.append("");
        whenEndDate.append("");        
    }

    var where = $('<td></td>');
    for (i = 0; i < where.length; i++) {
        where.append(getWhereLink(reminder.where[i]));
        if (reminder.where[i].proximity !== undefined) {
            where.append(" (within " + reminder.where[i].proximity.amount + " " + reminder.where[i].proximity.units + ") <br/>");
        }
    }

    var enabled = $('<td></td>');
    if (reminder.enabled === undefined || reminder.enabled) { 
        enabled.append("Yes"); 
    } else {
        enabled.append("No");
    }

    var editCell = $('<td></td>');
    var editButton = $('<button id="editIndividualReminderButton-' + reminder.id + '" class="reminderButton" type="button">Edit</button>');
    editButton.click(onEditIndividualButton);
    editCell.append(editButton);
    var deleteCell = $('<td></td>');
    var deleteButton = $('<button id="deleteIndividualReminderButton-' + reminder.id + '" class="reminderButton" type="button">Delete</button>');
    deleteButton.click(onDeleteIndividualButton);
    deleteCell.append(deleteButton);

    row.append(desc);
    row.append(whenStartTime);
    row.append(whenStartDate);
    row.append(whenEndTime);
    row.append(whenEndDate);
    row.append(whenRecurring);
    row.append(where);
    row.append(enabled);
    row.append(editCell);
    row.append(deleteCell);

    return row;
}

function onEditIndividualButton() {
    hideViewPage();
    var buttonid = $(this).attr("id");
    var reminderId = buttonid.substr(buttonid.indexOf("-") + 1);
    loadAddPage(reminders[reminderId]);
}

function onDeleteIndividualButton() {
    var buttonid = $(this).attr("id");
    var reminderId = buttonid.substr(buttonid.indexOf("-") + 1);
    alert("Click!");
}

function getWhereLink(whereObject) {
    var whereLink;
    if (whereObject.place !== undefined) {
        whereLink = $('<a></a>');
        whereLink.attr('id', "linkto-" + whereObject.place.id);
        whereLink.attr('href', "#" + whereObject.place.id);
        whereLink.addClass("whereLink");
        whereLink.click(highlightPlace);
        whereLink.text(whereObject.place.description);
    } else {
        whereLink = $("<span>Any location</span>");
    }
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
    var image_url = "http://maps.googleapis.com/maps/api/staticmap?" + "center=" + coords.latitude + "," + coords.longitude + "&zoom=12&size=400x400&sensor=false" + "&markers=color:blue|label:S|" + coords.latitude + ',' + coords.longitude;
    var gMap = $("<img />");
    gMap.attr("src", image_url).attr('id', MAP_IMG_ID);
    return gMap;
}
