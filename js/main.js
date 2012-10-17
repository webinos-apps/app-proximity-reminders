/* This file uses globals.  Read the globals.js to check which ones */
$(document).ready(function () {
    refreshAllReminders();
});

function refreshAllReminders() {
    getAllData(function (data) {
        places = data.places;
        reminders = data.reminders;
        loadApp();
    },

    function (err) {
        $("#frontStatus").css("color", "red");
        $("#frontStatus").text("Error connecting to webinos");
        console.log("Error:  " + err);
    });
}

function makeEnabled() {
    $("#viewReminders").attr('disabled', false);
    $("#createReminder").attr('disabled', false);
    $("#frontStatus").css("color", "black");
    $("#frontStatus").text("Connected to webinos");
}


function loadApp() {
    makeEnabled();
    $("#createReminder").click(function () {
        hideViewPage();
        loadAddPage();
    });
    $("#viewReminders").click(function () {
        hideAddPage();
        loadViewPage();
    });
}

function startTicker() {
    reminderInterval = setInterval(function() { 
        doReminders(reminders);
    }, 5000);  
}

function doReminders(rems) {
    //TODO: work out if there are any reminders to trigger
    //      then trigger them and set 'enabled' to false.
    //
}


function hideAddPage() {
    if ($("#" + EDIT_DIV_ID).length > 0) {
        $("#" + EDIT_DIV_ID).hide();
    }
}

function loadAddPage(reminder) {
    var addDiv = $("#" + EDIT_DIV_ID);

    if (reminder !== undefined) {
        console.log("Editing reminder: " + JSON.stringify(reminder));
        addDiv.show();
    } else {
        addDiv.show();
    }
    getEditPage(reminder);
}



function hideViewPage() {
    if ($("#" + VIEW_DIV_ID).length > 0) {
        $("#" + VIEW_DIV_ID).hide();
    }
}

function loadViewPage() {
    $("#morecontent").append("<div id='" + VIEW_DIV_ID + "'></div>");
    var viewDiv = $("#" + VIEW_DIV_ID);
    getRemindersPage();
    getPlaces();
    viewDiv.show();
}

