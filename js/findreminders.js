var finder = {};

finder.findValidReminders = function(date, location, reminderList) {
    var valid = [];
    for (var r in reminderList) {
        if (finder.isValidReminder(date, location, reminderList[r])) {
            console.log("Found valid reminder: " + reminderList[r].description);
            valid.push(reminderList[r]);
        }
    }
    return valid;
}


finder.isValidReminder = function(date, location, reminder) {
    if (reminder.enabled) {
        console.log("Reminder " + reminder.description + " is enabled");
    } else {
        console.log("Reminder " + reminder.description + " is not enabled");        
    }
    if (finder.isValidReminderTime(date, reminder)) {
        console.log("Reminder " + reminder.description + " is at the RIGHT time");        
    } else {
        console.log("Reminder " + reminder.description + " is at the wrong time");
    }
    if (finder.isValidReminderPlace(location, reminder)) {
        console.log("Reminder " + reminder.description + " is at the RIGHT place");
    } else {
        console.log("Reminder " + reminder.description + " is at the wrong place");
    }
    
    var result = reminder.enabled && 
        finder.isValidReminderTime(date, reminder) &&
        finder.isValidReminderPlace(location, reminder);

    return result;
}


finder.isValidReminderTime = function(date, reminder) {
    return (reminder.when === "anytime" || 
                (reminder.when.startdate === undefined &&
                 reminder.when.enddate === undefined)) ||
           (reminder.when.startdate !== undefined &&
                reminder.when.startdate < date &&   
                (reminder.when.enddate === undefined || 
                    reminder.when.enddate > date)) ||     
           (reminder.when.enddate !== undefined && 
                reminder.when.enddate > date && 
                    (reminder.when.startdate === undefined || 
                    reminder.when.startdate < date));
}

finder.isValidReminderPlace = function(location, reminder) {
      
    if (reminder.where === undefined || 
            reminder.where === "anywhere" || 
            reminder.where.length === 0 ||
            reminder.where[0] === "anywhere" ||
            reminder.where[0].place === undefined) {
        return true;
    }
    
    //we're assuming that if it *has* a place, then it has a proximity too.
        
   
    //there might have been some error on location.  Lets check.
    if (location === null || 
            location.latitude === null || 
            location.longitude === null) {
        return false;
    }
    
    var lat1 = location.latitude;
    var lon1 = location.longitude;
    var lat2 = reminder.where[0].place.coordinates.latitude;
    var lon2 = reminder.where[0].place.coordinates.longitude;
    
    //assume metres for now   
   
    return (finder.getDistance(lat1, lon1, lat2, lon2) <= 
        Number(reminder.where[0].proximity.amount));
}

finder.getDistance = function(lat1, lon1, lat2, lon2) {
    // taken from http://www.movable-type.co.uk/scripts/latlong.html
    // this is the haversine formula
    
    if (typeof(Number.prototype.toRad) === "undefined") {
      Number.prototype.toRad = function() {
        return this * Math.PI / 180;
      }
    }

    
    
    var R = 6371; // km
    var dLat = (lat2-lat1).toRad();
    var dLon = (lon2-lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    
    d = d*1000;
    
    console.log("Distance between two places: " + d);   
    return d;
}
