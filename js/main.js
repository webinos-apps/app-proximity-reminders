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
    alerter.jalert("Reminder removed: " + reminder.description);
}

main.removePlace = function(place) {
    console.log("Removing place from the UI");
    delete main.places[place.id];
    main.loadViewPage();
    alerter.jalert("Place removed: " + place.description);
}


main.makeEnabled = function() {
    $("#viewReminders").attr('disabled', false);
    $("#createReminder").attr('disabled', false);
    $("#frontStatus").css("color", "#840");
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
    if(main.windowWidth <= 960) {
		main.slideContent();
	}
}



main.hideViewPage = function() {
    if ($("#" + VIEW_DIV_ID).length > 0) {
        $("#" + VIEW_DIV_ID).hide();
    }
}

main.loadViewPage = function() {
    var viewDiv = $("#" + VIEW_DIV_ID);
    viewer.getRemindersPage(main.reminders);
    viewer.getPlaces(main.places, main.reminders);
    viewDiv.show();
    if(main.windowWidth <= 960) {
		main.slideContent();
	}
}

main.slideContent = function(back) {
	var conDiv = document.getElementById(CONTENT_DIV_ID);
	var winWidth;
	if(back) {
		winWidth = 0;
	} else {
		winWidth = main.windowWidth;
	}
	conDiv.style.msTransform = "translateX(-"+winWidth+"px)";
	conDiv.style.MozTransform = "translateX(-"+winWidth+"px)";
	conDiv.style.OTransform = "translateX(-"+winWidth+"px)";
	conDiv.style.webkitTransform = "translateX(-"+winWidth+"px)";
	conDiv.style.transform = "translateX(-"+winWidth+"px)";
}

$(document).ready(function () {
    main.refreshAllReminders();
    main.windowWidth = window.innerWidth;
    if(main.windowWidth <= 960) {
		document.getElementById(CONTENTS_LEFT_DIV_ID).style.width = main.windowWidth+"px";
		document.getElementById(CONTENTS_RIGHT_DIV_ID).style.width = main.windowWidth+"px";
		$("#"+MOBILE_BACK_FOOTER_ID).click(function () {
			main.slideContent(true);
		});
	}
});