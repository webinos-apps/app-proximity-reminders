var alerter = {};
alerter.reminderInterval = null;
alerter.ticker = {};

alerter.check = function() {
    if ($("#checkReminders").is(':checked')) {
        alerter.doAllReminders(main.reminders);
        alerter.ticker.start();
    } else {
        alerter.ticker.stop();
    }
}

alerter.ticker.stop = function() {
    if (alerter.reminderInterval !== null) {
        console.log("Stopping ticker");
        clearInterval(alerter.reminderInterval);
        alerter.reminderInterval = null;
    }
}

alerter.ticker.start = function() {
    if (alerter.reminderInterval === null) {
        console.log("Starting ticker");
        alerter.reminderInterval = setInterval(function() { 
            console.log("Checking all reminders");
            alerter.doAllReminders(main.reminders);
        }, 10000);
    }  
}

alerter.doAllReminders = function(rems) {
    geoTools.geoGetCurrentPosition(function(position) {
        var valid = finder.findValidReminders(new Date(), position.coords, rems);
        console.log("Found " + valid.length + " valid reminders");
        for (var i=0; i<valid.length; i++) {
            alerter.showReminderAlert(valid[i]);       
        }    
    }, function(err) {
        console.log("Failed to get a valid position");
        var valid = finder.findValidReminders(new Date(), null, rems);
        
    });
}

function rubbishClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

alerter.detatchReminderPlace = function(reminder) {
    if (reminder.where !== undefined && reminder.where !== "anywhere") {
        for (var i = 0; i< reminder.where.length; i++) {
            if (reminder.where[i] !== undefined && 
                    reminder.where[i] !== "anywhere" && 
                    reminder.where[i].place !== undefined && 
                    reminder.where[i].place.id !== undefined) {
                    
                reminder.where[i].place = reminder.where[i].place.id;        
            }
        }
    }
    return reminder;
}

alerter.showReminderAlert = function(reminder) {
    //TODO: Work with W3C Notifications ... not supported in Mozilla.
    $("#reminderNotification").show();
    if (reminder.showing === undefined || !reminder.showing) {    
        var reminderText = $("<p></p>");
        reminderText.attr("id", "alert-" + reminder.id );
        reminderText.append(reminder.description);
        var reminderButton = $("<button type='button'>Ok</button>");
        reminderText.append(reminderButton);
        reminderButton.bind('click', function() {
            reminder.enabled = false;
            delete reminder.showing;
            if ($("#reminderNotification").children().size() === 1) {
                $("#reminderNotification").hide();
            }
            alerter.save(reminder);
            $("#alert-" + reminder.id).remove();
        });
        $("#reminderNotification").append(reminderText);
        reminder.showing = true;
    }
}

alerter.save = function(reminder) {
    var clonedReminder = rubbishClone(reminder);
    var detatchedClonedReminder = alerter.detatchReminderPlace(clonedReminder);
    //TODO: Enable this.
    //storer.saveReminder(detatchedClonedReminder);
    main.loadViewPage();
}

