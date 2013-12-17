var viewer = {};

viewer.getRemindersPage = function(reminders) {
    var list = $('#viewList');
    list.empty();
    for (var r in reminders) {
        var listItem = viewer.getReminderItem(reminders[r]);
        var listItemLi = $('<li class="reminderListItem"></li>');
        listItemLi.append(listItem);
        list.append(listItemLi);
    }
}

viewer.highlightPlace = function(place) {
    viewer.showMapId(place);
}

viewer.clickReminder = function(reminder) {
    $('#reminderItemDetails-' + reminder.id).toggle();
}

viewer.getReminderItem = function(reminder) {
    var row = $('<div id="reminderView-' + reminder.id + '" class=\'reminderItem\'></div>');
    var desc = $('<a href="#description-' + reminder.id + '" class="reminderItemDescription" id="reminderItemDescription-' + reminder.id + '"></a>').text(reminder.description);
    var rowDetails = $('<div id="reminderItemDetails-' + reminder.id + '"></div>');

    desc.unbind("click");
    desc.on("click", null, reminder, function(evt) {
       viewer.clickReminder(evt.data);
    });

    var whenStartTime = $('<div class="reminderItemDetails reminderItemStartTime"></div>');
    var whenStartDate = $('<div class="reminderItemDetails reminderItemStartDate"></div');
    var whenEndTime = $('<div class="reminderItemDetails reminderItemEndTime"></div');
    var whenEndDate = $('<div class="reminderItemDetails reminderItemEndDate"></div');

    var whenRecurring = $('<div class="reminderItemDetails reminderItemRecurring"></div');
    if (reminder.when !== undefined && reminder.when !== "anytime" && reminder.when.startdate !== undefined && reminder.when.enddate !== undefined) {
        console.log(reminder);
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

    var where = $('<div class="reminderItemDetails reminderItemLocation"></div');
    for (var i = 0; i < where.length; i++) {
        where.append(viewer.getWhereLink(reminder.where[i]));
        if (reminder.where[i].proximity !== undefined) {
            where.append(" (within " + reminder.where[i].proximity.amount + " " + reminder.where[i].proximity.units + ") <br/>");
        }
    }

    var enabled = $('<div class="reminderItemDetails reminderItemEnabled"></div>');
    if (reminder.enabled === undefined || reminder.enabled) {
        enabled.append("Yes");
    } else {
        enabled.append("No");
        row.addClass("disabledReminder");
    }

    var devicesToRemind = $('<div class="reminderItemDetails reminderItemDevices"></div>');
    if (reminder.hasOwnProperty('devices') && reminder.devices !== undefined && Array.isArray(reminder.devices) && reminder.devices.length > 0) {
      var deviceToRemindList = $('<ul></ul>');
      for (var i=0; i< reminder.devices.length; i++) {
        deviceToRemindList.append($('<li>' + reminder.devices[i].serviceAddress + '</li>'));
      }
      devicesToRemind.append(deviceToRemindList);
    } else {
      devicesToRemind.append("All devices");
    }

    var editCell = $('<div class="reminderItemEditCell"></div');
    var editButton = $('<button id="editIndividualReminderButton-' + reminder.id + '" class="reminderButton" type="button">Edit</button>');
    editButton.unbind("click");
    editButton.click(function() {
        viewer.onEditIndividualButton(reminder);
    });
    editCell.append(editButton);
    var deleteCell = $('<div class="reminderItemDeleteCell"></div');
    var deleteButton = $('<button id="deleteIndividualReminderButton-' + reminder.id + '" class="reminderButton" type="button">Delete</button>');
    deleteButton.unbind("click");
    deleteButton.on("click", null, reminder, function(evt) {
        viewer.onDeleteIndividualButton(evt.data);
    });
    deleteCell.append(deleteButton);

    row.append(desc);
    row.append(rowDetails);

    var whenStartTimeTitle = $('<div class="reminderTitle">Start time:</div>');
    whenStartTimeTitle.append(whenStartTime);
    var whenStartDateTitle = $('<div class="reminderTitle">Start date:</div>');
    whenStartDateTitle.append(whenStartDate);
    var whenEndTimeTitle = $('<div class="reminderTitle">End time:</div>');
    whenEndTimeTitle.append(whenEndTime);
    var whenEndDateTitle = $('<div class="reminderTitle">End date:</div>');
    whenEndDateTitle.append(whenEndDate);
    var whenRecurringTitle = $('<div class="reminderTitle">Recurrs:</div>');
    whenRecurringTitle.append(whenRecurring);
    if (whenStartDate.text() !== "") {
        rowDetails.append(whenStartTimeTitle);
        rowDetails.append(whenStartDateTitle);
        rowDetails.append(whenEndTimeTitle);
        rowDetails.append(whenEndDateTitle);
        rowDetails.append(whenRecurringTitle);
    } else {
        rowDetails.append(whenStartTimeTitle);
    }

    var whereTitle = $('<div class="reminderTitle">Location: </div>');
    whereTitle.append(where);

    var devicesTitle = $('<div class="reminderTitle">Devices to remind: </div>');
    devicesTitle.append(devicesToRemind);

    var enabledTitle = $('<div class="reminderTitle">Enabled? </div>');
    enabledTitle.append(enabled);

    rowDetails.append(whereTitle);
    rowDetails.append(devicesTitle);
    rowDetails.append(enabledTitle);
    rowDetails.append(editCell);
    rowDetails.append(deleteCell);
    rowDetails.hide();

    return row;
}

viewer.onEditIndividualButton = function(reminder) {
    main.hideViewPage();
    main.loadAddPage(reminder);
}

viewer.onDeleteIndividualButton = function(reminder) {
    storer.deleteReminder(reminder, function() {

        main.removeReminder(reminder);
    }, function(err) {
        alerter.jalert("Could not remove reminder: " + reminder.description);
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

viewer.getPlaces = function(places, reminders) {
    var list = $('#placeUL');
    list.empty();
    for (var p in places) {
        var placeItem = viewer.getPlaceListItem(places[p], reminders);
        list.append(placeItem);
    }
    return list;
}

viewer.getPlaceListItem = function(place, reminders) {
    var placeItem = $('<li class="placeListItem"></li>');
    var placeLink = $('<a></a>  ');
    placeLink.text(place.description);
    placeLink.attr('id', "placelist-link-" + place.id);
    placeLink.attr('href', "#" + place.id);
    placeLink.addClass("placeLink");
    placeLink.unbind("click");
    placeLink.on("click", null, place, function(evt) {
        viewer.showMapId(evt.data);
    });

    placeItem.append(placeLink);
    return placeItem;
}

viewer.isOrphanPlace = function(place, reminders) {
    console.log("Called isOrphanPlace - " + JSON.stringify(reminders));
    for (var r in reminders) {
        if (reminders[r].where !== null && reminders[r].where.length > 0) {
            for (var w in reminders[r].where) {
                if (reminders[r].where[w] !== "anywhere") {
                    if (reminders[r].where[w].place.id === place.id) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

viewer.deletePlace = function(place) {
    storer.deletePlace(place, function() {
        main.removePlace(place);
    }, function(err) {
        alerter.jalert("Could not remove place: " + place.description);
        console.log(err);
    });
}

viewer.showMapId = function(place) {

    $('#map').html(viewer.getGoogleMap(place.coordinates));
    $('#mapImgWrapper').show();
    $('#mapImgHeading').text(place.description);

    if (viewer.isOrphanPlace(place, main.reminders)) {
        var placeDeleteButton = $('<button id="deletePlace-' + place.id + '" class="deletePlaceButton" type="button">Delete "' + place.description + '"</button>');
        placeDeleteButton.unbind("click");
        placeDeleteButton.on("click", null, place, function(evt) {
            viewer.deletePlace(evt.data);
        });
        $('#mapImgDeleteButton').append(placeDeleteButton);
    } else {
        $('#mapImgDeleteButton').empty();
    }

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

    var image_url = "http://maps.googleapis.com/maps/api/staticmap?" + "center=" + coords.latitude + "," + coords.longitude + "&zoom=12&size=300x300&sensor=false" + "&markers=color:blue|label:S|" + coords.latitude + ',' + coords.longitude;
    var gMap = $("<img />");
    gMap.attr("src", image_url).attr('id', MAP_IMG_ID).attr('width', '300px').attr('height', '300px');
    return gMap;
}
