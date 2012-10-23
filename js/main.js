var main = {};
main.reminders = null;
main.places = null;


main.refreshAllReminders = function() {
    storer.getAllData(function (data) {
        main.places = data.places;
        main.reminders = data.reminders;
        main.loadApp();
    },

    function (err) {
        $("#frontStatus").css("color", "red");
        $("#frontStatus").text("Error connecting to webinos");
        console.log("Error:  " + err);
    });
}

main.removeReminder = function(reminder) {
    console.log("Removing reminder from the UI");
    delete main.reminders[reminder.id];
    main.loadViewPage();
    alert("Reminder removed: " + reminder.description);    
}

main.makeEnabled = function() {
    $("#viewReminders").attr('disabled', false);
    $("#createReminder").attr('disabled', false);
    $("#frontStatus").css("color", "black");
    $("#frontStatus").text("Connected to webinos");
}


main.loadApp = function() {
    main.makeEnabled();
    $("#createReminder").unbind("click");
    $("#createReminder").click(function () {
        main.hideViewPage();
        main.loadAddPage();
    });
    $("#viewReminders").unbind("click");
    $("#viewReminders").click(function () {
        main.hideAddPage();
        main.loadViewPage();
    });
    $("#checkReminders").unbind("change");
    $("#checkReminders").change(alerter.check)
    
    alerter.check();
}

main.hideAddPage = function() {
    if ($("#" + EDIT_DIV_ID).length > 0) {
        $("#" + EDIT_DIV_ID).hide();
    }
}

main.loadAddPage = function(reminder) {
    var addDiv = $("#" + EDIT_DIV_ID);

    if (reminder !== undefined) {
        console.log("Editing reminder: " + JSON.stringify(reminder));
        addDiv.show();
    } else {
        addDiv.show();
    }
    editor.getEditPage(main.reminders, main.places, reminder);
}



main.hideViewPage = function() {
    if ($("#" + VIEW_DIV_ID).length > 0) {
        $("#" + VIEW_DIV_ID).hide();
    }
}

main.loadViewPage = function() {
    $("#morecontent").append("<div id='" + VIEW_DIV_ID + "'></div>");
    var viewDiv = $("#" + VIEW_DIV_ID);
    viewer.getRemindersPage(main.reminders);
    viewer.getPlaces(main.places);
    viewDiv.show();
}


$(document).ready(function () {
    main.refreshAllReminders();
});

