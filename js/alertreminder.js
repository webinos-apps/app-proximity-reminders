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

alerter.showBrowserNotification = function(reminder) {
  if (typeof(window.Notification) !== "undefined") {
      var newNotif = new Notification("Reminder: " + reminder.description,
      {iconUrl: "../remind_me.png",
       tag: reminder.id,
       onshow: function() {
          alerter.close(reminder);
       }
       } 
     );
     newNotif.show();
  }
}

alerter.showHTMLNotification = function(reminder) {
  var reminderText = $("<p></p>");
  reminderText.attr("id", "alert-" + reminder.id );
  reminderText.append(reminder.description);
  var reminderButton = $("<button type='button'>Ok</button>");
  reminderText.append(reminderButton);
  reminderButton.bind('click', function() {
      alerter.close(reminder);
  });
  $("#reminderNotification").append(reminderText);
}

alerter.showWebinosNotification = function(reminder) {
  var useWebNotServ = function(service) {
    new service.WebNotification("Reminder!", 
      {body: reminder.description, iconUrl: "../remind_me.png"});
		service.onClick = function () {
		  console.log("reminder notification clicked");
	  };
		service.onClose = function (){
		  console.log("reminder notification closed");
		  alerter.close(reminder);
	  };
		service.onShow  = function (){
		  console.log("reminder notification showed");
	  }
		service.onError = function (err){
		  console.log("reminder notification error");
	  };         
  };
  var foundWebNotServ = function(service) {
    service.bindService({ onBind: useWebNotServ });
      
  };  
  var findWebNotServ = function() {
    webinos.discovery.findServices(
      new ServiceType('http://webinos.org/api/webnotification'), 
      { onFound: foundWebNotServ });
  };
  findWebNotServ();
}

alerter.showReminderAlert = function(reminder) {
    $("#reminderNotification").show();
    if (reminder.showing === undefined || !reminder.showing) {    
        alerter.showBrowserNotification(reminder);
        alerter.showHTMLNotification(reminder);
        alerter.showWebinosNotification(reminder);
        reminder.showing = true;
    }
}

alerter.close = function(reminder) {
    console.log("Closing reminder " + JSON.stringify(reminder));
    reminder.enabled = false;
    delete reminder.showing;
    if ($("#reminderNotification").children().size() === 1) {
        $("#reminderNotification").hide();
    }
    alerter.save(reminder);
    $("#alert-" + reminder.id).remove();
}

alerter.save = function(reminder) {
    var clonedReminder = rubbishClone(reminder);
    var detatchedClonedReminder = alerter.detatchReminderPlace(clonedReminder);
    //TODO: Enable this.
    storer.saveReminder(detatchedClonedReminder, function() { 
        console.log("Successfully set the reminder to 'disabled' after user clicks 'ok'");    
    }, function(err) { 
        console.log("Failed to set the reminder to 'disabled' after user clicks 'ok'");
    });
    main.loadViewPage();
}

alerter.jalert = function(text) {
    $('#alertPopupDiv').text(text);
    $('#alertPopupDiv').dialog(
        {   
            buttons: { 
                Ok : function() {
                    $(this).dialog("close");
                }
            },
            dialogClass: "alert",
            modal : true
        }    
    );
}

