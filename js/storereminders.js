/* This file uses globals.  Read the globals.js to check which ones */

var storer = {};
storer.fileService = null;
storer.fileSystem = null;


storer.createReminderId = function() {
    return "reminder-" + Date.now();
}

/* use the FileAPI to save a reminder to disk. */
storer.saveReminder = function(reminder, successcb, errorcb) {
    //pre: the reminder's 'place' has been detatched
    console.log("Requested to save reminder: " + reminder.description);
    console.log("Reminder: " + JSON.stringify(reminder));
    storer.getFileService(function (svc) {
        storer.getDirectories(storer.fileService, function (fs, dirs) {
            if (reminder.id === undefined || reminder.id === null) {
                reminder.id = storer.createReminderId();
            }
            storer.saveTextFile(dirs.remindersdir,
            JSON.stringify(reminder),
            reminder.id + ".json",
            successcb,
            errorcb);
        }, function (err) {
            console.log(err.code);
            errorcb(err);
        });
    }, function (err) {
        console.log(err.code);
        errorcb(err);
    });
}


storer.savePlace = function(place, successcb, errorcb) {
    if (place === null || place === "anywhere") {
        console.log("No need to add place: not real");
        successcb();
        return;
    }
    console.log("Requested to save place: " + place.description);
    storer.getFileService(function (svc) {
        storer.getDirectories(storer.fileService, function (fs, dirs) {
            storer.saveTextFile(dirs.placesdir,
            JSON.stringify(place),
            place.id + ".json",
            successcb,
            errorcb);
        }, function (err) {
            console.log(err.code);
            errorcb(err);
        });
    }, function (err) {
        console.log(err.code);
        errorcb(err);
    });
}


storer.saveTextFile = function(dir, val, filename, successcb, errorcb) {
    dir.getFile(filename, {
        create: true
    }, function (fileEntry) {
        fileEntry.createWriter(function (fileWriter) {

            fileWriter.onwriteend = function (e) {
                console.log('Write completed.');
                successcb();
            };

            fileWriter.onerror = function (e) {
                console.log('Write failed: ' + e.toString());
                errorcb(e);
            };

            var blob = new Blob([val], {
                type: 'text/plain'
            });

            fileWriter.write(blob);

        }, errorcb);

    }, errorcb);
}

storer.deleteReminder = function(reminder, successcb, errorcb) {
    console.log("Requested to delete reminder: " + reminder.description);
    if (typeof(reminder.id) === undefined || reminder.id === null) {
        errorcb("Invalid reminder: no reminder ID");
        return;
    }
    
    storer.getFileService(function (svc) {
        storer.getDirectories(storer.fileService, function (fs, dirs) {
            
            storer.deleteFile(dirs.remindersdir,
                reminder.id + ".json",
                successcb,
                errorcb);
        }, function (err) {
            console.log(err.code);
            errorcb(err);
        });
    }, function (err) {
        console.log(err.code);
        errorcb(err);
    }); 
}

storer.deletePlace = function(place, successcb, errorcb) {
    //post: this wont update reminders with this place ID.  Sorry.
    console.log("Requested to delete place: " + place.description);
    if (typeof(place.id) === undefined || place.id === null) {
        errorcb("Invalid place: no place ID");
        return;
    }
    
    storer.getFileService(function (svc) {
        storer.getDirectories(storer.fileService, function (fs, dirs) {
            
            storer.deleteFile(dirs.placesdir,
            place.id + ".json",
            successcb,
            errorcb);
        }, function (err) {
            console.log(err.code);
            errorcb(err);
        });
    }, function (err) {
        console.log(err.code);
        errorcb(err);
    }); 
    
}


storer.deleteFile = function(dir, filename, successcb, errorcb) {

    dir.getFile(filename, {create: false}, function(fileEntry) {

        fileEntry.remove(function() {
          console.log('File removed: ' + filename);
          successcb();
        }, errorcb);
    }, errorcb);

}


/* get all reminders from disk.  At the moment I'm not going to try and
   do anything more complicated than this. */
storer.getAllData = function(successcb, errorcb) {
    storer.getFileService(function (svc) {
        storer.getDirectories(storer.fileService, function (fs, dirs) {
            storer.getData(storer.fileSystem, dirs, successcb, errorcb);
        }, function (err) {
            console.log(err.code);
            errorcb(err);
        });
    }, function (err) {
        console.log(err.code);
        errorcb(err);
    });
}

storer.toArray = function(list) {
    return Array.prototype.slice.call(list || [], 0);
}


storer.fileToObject = function(fs, fileEntry, successcb, errorcb) {
    fileEntry.file(function (file) {
        var reader = new window.FileReader(fs);
        reader.onloadend = function (evt) {
            if (evt.target.readyState === FileReader.DONE && evt.target.result !== "") {
                var place = JSON.parse(evt.target.result);
                successcb(place);
            } else {
                errorcb("You're probably using Chrome, which isn't supported as this local file uses the file API");
            }
        };
        reader.readAsText(file);
    }, errorcb);
}

storer.listOfFilesToObjects = function(fs, fileArray, converter, successcb, errorcb) {
    if (fileArray.length > 0) {
        var currFile = fileArray.pop();
        storer.listOfFilesToObjects(fs, fileArray, converter, function (rest) {
            converter(fs, currFile, function (currObj) {
                rest.push(currObj);
                successcb(rest);
            }, errorcb);
        }, errorcb);
    } else {
        successcb([]);
    }
}


storer.placeFileToObject = function(fs, placeFile, successcb, errorcb) {
    //console.log("Converting place file to object: " + placeFile.name);
    // TODO fix date
    // TODO validate input

    storer.fileToObject(fs, placeFile, successcb, errorcb);
}

storer.getPlace = function(placeid, places) {
    return places[placeid];
}

storer.reminderFileToObject = function(places, fs, reminderFile, successcb, errorcb) {
    //console.log("Converting reminder file to object: " + reminderFile.name);
    // TODO fix date
    // TODO validate input

    storer.fileToObject(fs, reminderFile, function (reminder) {
        //link to the places file.		
        for (var i = 0; i < reminder.where.length; i++) {
            if (reminder.where[i].place !== undefined && reminder.where[i].place !== "anywhere") {
                reminder.where[i].place = places[reminder.where[i].place];
                if (reminder.where[i].proximity === undefined || 
                    reminder.where[i].proximity.amount === undefined || 
                    reminder.where[i].proximity.units === undefined) {
                    reminder.where[i].proximity = {
                        amount : "10",
                        units : "metres"
                    }
                }
            }
        }

        if (reminder.when.startdate !== undefined) {
            reminder.when.startdate = new Date(reminder.when.startdate);
        }
        if (reminder.when.enddate !== undefined) {
            reminder.when.enddate = new Date(reminder.when.enddate);
        }

        
        if (reminder.enabled === undefined) {
            reminder.enabled = true;
        }

        

        successcb(reminder);
    }, errorcb);
}

storer.processReminderFiles = function(fs, reminderFile, places, successcb, errorcb) {
    //console.log("Reading reminder files - " + reminderFile.length + " - in total");
    storer.listOfFilesToObjects(fs, reminderFile, function (fs, fileEntry, successcb, errorcb) {
        storer.reminderFileToObject(places, fs, fileEntry, successcb, errorcb);
    }, successcb, errorcb);
}

storer.processPlacesFiles = function(fs, placesFiles, successcb, errorcb) {
    //console.log("Reading places files - " + placesFiles.length + " - in total");
    storer.listOfFilesToObjects(fs, placesFiles, storer.placeFileToObject, 
        successcb, errorcb);
}

storer.arrayToObject = function(arr, idfield) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        var key = arr[i][idfield];
        var val = arr[i];
        obj[key] = val;
    }
    return obj;
}

storer.getData = function(fs, dirs, successcb, errorcb) {
    //console.log("Getting data from " + dirs.placesdir.name + " and " + dirs.remindersdir.name);
    storer.getFiles(fs, dirs.placesdir, function (placesFiles) {
        storer.processPlacesFiles(fs, placesFiles, function (placesArr) {
            var places = storer.arrayToObject(placesArr, "id");
            storer.getFiles(fs, dirs.remindersdir, function (reminderFiles) {
                storer.processReminderFiles(fs, reminderFiles, places, function (remindersObj) {
                    var reminders = storer.arrayToObject(remindersObj, "id");
                    successcb({
                        "reminders": reminders,
                        "places": places
                    });
                }, errorcb);
            }, errorcb);
        }, errorcb);
    }, errorcb);
}

storer.getFiles = function(fs, dir, successcb, errorcb) {
    storer.getDirectoryContent(fs, dir, function (list) {
        var res = [];
        for (var i = 0; i < list.length; i++) {
            //console.log("Found directory entry: " + list[i].name);
            if (list[i].isFile && (list[i].name.indexOf("~") < (list[i].name.length - 1))) {
                res.push(list[i]);
            }
        }
        successcb(res);
    }, errorcb);
}


storer.getDirectoryContent = function(fs, dir, successcb, errorcb) {
    var dirReader = dir.createReader();
    var entries = [];

    // Call the reader.readEntries() until no more results are returned.
    var readEntries = function () {
        dirReader.readEntries(function (results) {
            if (!results.length) {
                successcb(entries.sort());
            } else {
                //console.log("Adding directory entries");
                entries = entries.concat(storer.toArray(results));
                readEntries();
            }
        }, errorcb);
    };

    readEntries();
}

storer.getFileSystem = function(fileService, successcb, errorcb) {
    if (storer.fileSystem !== null) {
        successcb(fileSystem);
    } else {
        fileService.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, successcb, errorcb);
    }
}


storer.getDirectories = function(fileService, successcb, errorcb) {
    storer.getFileSystem(fileService, onInitFs, fsErrorHandler);

    function onInitFs(fs) {
        fileSystem = fs;
        fs.root.getDirectory(STORE_DIRECTORY, {
            create: true
        }, function (approot) {
            approot.getDirectory(REMINDER_DIRECTORY, {
                create: true
            }, function (reminders) {
                approot.getDirectory(PLACE_DIRECTORY, {
                    create: true
                }, function (places) {
                    successcb(fs, {
                        "appdir": approot,
                        "remindersdir": reminders,
                        "placesdir": places
                    });
                }, fsErrorHandler);
            }, fsErrorHandler);
        }, fsErrorHandler);
    }

    function fsErrorHandler(err) {
        console.log("Failed to request file system");
        storer.errorHandler(err);
        errorcb(err);
    }
}


storer.getFileService = function(successcb, errorcb) {
    if (storer.fileService !== null) {
        successcb(storer.fileService);
        return;
    }
    var once = false;


    function find() {
        webinos.discovery.findServices(
        new ServiceType('http://webinos.org/api/file'), {
            onFound: on_service_found
        });
    }

    function on_service_found(service) {
        if (!once) {
            once = true;
            bind(service);
        } else {
            console.log("Not bound : " + service.serviceAddress);
            errorcb("Failed to bind to webinos file service");
        }
    }

    function bind(service) {
        service.bindService({
            onBind: function (boundService) {
                storer.fileService = boundService;
                successcb(boundService);
            }
        });
    }

    find();

}


/* Shamelessly stolen from http://www.html5rocks.com/en/tutorials/file/filesystem/ */

storer.errorHandler = function(e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    }

    console.log('Error: ' + msg);
    return "Error: " + msg;
}
