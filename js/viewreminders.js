var viewer = {};


viewer.getRemindersPage = function(reminders) {
    var table = $('#viewTable');
    table.empty();
    table.append(viewer.getReminderHeaderRow());
    for (var r in reminders) {
        var row = viewer.getReminderRow(reminders[r]);
        table.append(row);
    }
}

viewer.getReminderHeaderRow = function() {
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

viewer.highlightPlace = function(place) {
    viewer.showMapId(place);
}

viewer.getReminderRow = function(reminder) {

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
        where.append(viewer.getWhereLink(reminder.where[i]));
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
    editButton.unbind("click");
    editButton.click(function() {
        viewer.onEditIndividualButton(reminder);
    });
    editCell.append(editButton);
    var deleteCell = $('<td></td>');
    var deleteButton = $('<button id="deleteIndividualReminderButton-' + reminder.id + '" class="reminderButton" type="button">Delete</button>');
    deleteButton.unbind("click");
    deleteButton.on("click", null, reminder, function(evt) {
        viewer.onDeleteIndividualButton(evt.data);
    });
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

viewer.onEditIndividualButton = function(reminder) {
    main.hideViewPage();
    //var buttonid = $(this).attr("id");
    //var reminderId = buttonid.substr(buttonid.indexOf("-") + 1);
    main.loadAddPage(reminder);
}

viewer.onDeleteIndividualButton = function(reminder) {
//    var buttonid = $(this).attr("id");
//    var reminderId = buttonid.substr(buttonid.indexOf("-") + 1);
    storer.deleteReminder(reminder, function() {
        
        main.removeReminder(reminder);
    }, function(err) {
        alert("Could not remove reminder: " + reminder.description);
        console.log(err);
    });
}

viewer.getWhereLink = function(whereObject) {
    var whereLink;
    if (whereObject.place !== undefined) {
        whereLink = $('<a></a>');
        whereLink.attr('id', "linkto-" + whereObject.place.id);
        whereLink.attr('href', "#" + whereObject.place.id);
        whereLink.addClass("whereLink");
        whereLink.unbind("click");
        whereLink.on("click", null, whereObject.place, function(evt) {
            viewer.highlightPlace(evt.data);
        });
        whereLink.text(whereObject.place.description);
    } else {
        whereLink = $("<span>Any location</span>");
    }
    return whereLink;
}

viewer.getPlaces = function(places) {

    var list = $('#placeUL');
    list.empty();

    for (var p in places) {
        var placeItem = $('<li></li>');
        var placeLink = $('<a></a>');
        placeLink.text(places[p].description);
        placeLink.attr('id', "placelist-link-" + places[p].id);
        placeLink.attr('href', "#" + places[p].id);
        placeLink.addClass("placeLink");
        placeLink.unbind("click");
        placeLink.on("click", null, places[p], function(evt) {
            viewer.showMapId(evt.data);
        });
        placeItem.append(placeLink);
        list.append(placeItem);
    }

    return list;
}

viewer.showMapId = function(place) {
    $('#map').html(viewer.getGoogleMap(place.coordinates));
    $('.placeLink').addClass("notSelectedPlace");
    $('.placeLink').removeClass("selectedPlace");
    
    $('#placelist-link-' + place.id).addClass("selectedPlace");
    $('#placelist-link-' + place.id).removeClass("notSelectedPlace");
    
}

viewer.showMap = function() {
    var id = $(this).attr("id");
    viewer.showMapId(id);
}

viewer.getGoogleMap = function(coords) {
    var image_url = "http://maps.googleapis.com/maps/api/staticmap?" + "center=" + coords.latitude + "," + coords.longitude + "&zoom=12&size=400x400&sensor=false" + "&markers=color:blue|label:S|" + coords.latitude + ',' + coords.longitude;
    var gMap = $("<img />");
    gMap.attr("src", image_url).attr('id', MAP_IMG_ID);
    return gMap;
}
