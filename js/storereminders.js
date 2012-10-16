/* This file uses globals.  Read the globals.js to check which ones */

function createReminderId() {
    return "reminder-" + Date.now();
}

/* use the FileAPI to save a reminder to disk. */
function saveReminder(reminder, successcb, errorcb) {
    //pre: the reminder's 'place' has been detatched
    console.log("Requested to save reminder: " + reminder.description);
    getFileService(function (svc) {
        getDirectories(fileService, function (fs, dirs) {
            console.log("Saving reminder into dir: " + JSON.stringify(dirs.remindersdir));
            if (reminder.id === undefined || reminder.id === null) {
                reminder.id = createReminderId();
            }
            saveTextFile(dirs.remindersdir,
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


function savePlace(place, successcb, errorcb) {
    if (place === null || place === "anywhere") {
        console.log("No need to add place: not real");
        successcb();
        return;
    }
    console.log("Requested to save place: " + place.description);
    getFileService(function (svc) {
        getDirectories(fileService, function (fs, dirs) {
            console.log("Saving place into dir: " + JSON.stringify(dirs.placesdir));
            saveTextFile(dirs.placesdir,
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


function saveTextFile(dir, val, filename, successcb, errorcb) {
    console.log("Saving text file: " + filename + " into directory " + JSON.stringify(dir));
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


/* get all reminders from disk.  At the moment I'm not going to try and
   do anything more complicated than this. */
function getAllData(successcb, errorcb) {
    getFileService(function (svc) {
        getDirectories(fileService, function (fs, dirs) {
            getData(fileSystem, dirs, successcb, errorcb);
        }, function (err) {
            console.log(err.code);
            errorcb(err);
        });
    }, function (err) {
        console.log(err.code);
        errorcb(err);
    });
}

function toArray(list) {
    return Array.prototype.slice.call(list || [], 0);
}


function fileToObject(fs, fileEntry, successcb, errorcb) {
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

function listOfFilesToObjects(fs, fileArray, converter, successcb, errorcb) {
    if (fileArray.length > 0) {
        var currFile = fileArray.pop();
        listOfFilesToObjects(fs, fileArray, converter, function (rest) {
            converter(fs, currFile, function (currObj) {
                rest.push(currObj);
                successcb(rest);
            }, errorcb);
        }, errorcb);
    } else {
        successcb([]);
    }
}


function placeFileToObject(fs, placeFile, successcb, errorcb) {
    //console.log("Converting place file to object: " + placeFile.name);
    // TODO fix date
    // TODO validate input

    fileToObject(fs, placeFile, successcb, errorcb);
}

function getPlace(placeid, places) {
    return places[placeid];
}

function reminderFileToObject(places, fs, reminderFile, successcb, errorcb) {
    //console.log("Converting reminder file to object: " + reminderFile.name);
    // TODO fix date
    // TODO validate input

    fileToObject(fs, reminderFile, function (reminder) {
        //link to the places file.		
        for (var i = 0; i < reminder.where.length; i++) {
            if (reminder.where[i].place !== undefined && reminder.where[i].place !== "anywhere") {
                reminder.where[i].place = places[reminder.where[i].place];
                console.log("Reminder : " + JSON.stringify(reminder) + " has place " + places[reminder.where[i].place]);
            }
        }
        for (i = 0; i < reminder.when.length; i++) {
            if (reminder.when[i].date !== undefined) {
                reminder.when[i].date = new Date(reminder.when[i].date);
                console.log("Reminder : " + reminder.description + " has date " + reminder.when[i].date);
            }
        }

        successcb(reminder);
    }, errorcb);
}

function processReminderFiles(fs, reminderFile, places, successcb, errorcb) {
    //console.log("Reading reminder files - " + reminderFile.length + " - in total");
    listOfFilesToObjects(fs, reminderFile, function (fs, fileEntry, successcb, errorcb) {
        reminderFileToObject(places, fs, fileEntry, successcb, errorcb);
    }, successcb, errorcb);
}

function processPlacesFiles(fs, placesFiles, successcb, errorcb) {
    //console.log("Reading places files - " + placesFiles.length + " - in total");
    listOfFilesToObjects(fs, placesFiles, placeFileToObject, successcb, errorcb);
}

function arrayToObject(arr, idfield) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        var key = arr[i][idfield];
        var val = arr[i];
        obj[key] = val;
    }
    return obj;
}

function getData(fs, dirs, successcb, errorcb) {
    //console.log("Getting data from " + dirs.placesdir.name + " and " + dirs.remindersdir.name);
    getFiles(fs, dirs.placesdir, function (placesFiles) {
        processPlacesFiles(fs, placesFiles, function (placesArr) {
            var places = arrayToObject(placesArr, "id");
            //console.log("Places found : " + JSON.stringify(places));			
            getFiles(fs, dirs.remindersdir, function (reminderFiles) {
                processReminderFiles(fs, reminderFiles, places, function (remindersObj) {
                    var reminders = arrayToObject(remindersObj, "id");
                    successcb({
                        "reminders": reminders,
                        "places": places
                    });
                }, errorcb);
            }, errorcb);
        }, errorcb);
    }, errorcb);
}

function getFiles(fs, dir, successcb, errorcb) {
    getDirectoryContent(fs, dir, function (list) {
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


function getDirectoryContent(fs, dir, successcb, errorcb) {
    var dirReader = dir.createReader();
    var entries = [];

    // Call the reader.readEntries() until no more results are returned.
    var readEntries = function () {
        dirReader.readEntries(function (results) {
            if (!results.length) {
                successcb(entries.sort());
            } else {
                //console.log("Adding directory entries");
                entries = entries.concat(toArray(results));
                readEntries();
            }
        }, errorcb);
    };

    readEntries();
}

function getFileSystem(fileService, successcb, errorcb) {
    console.log("get FileSystem");
    if (fileSystem !== null) {
        console.log("... already have FileSystem");
        successcb(fileSystem);
    } else {
        fileService.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, successcb, errorcb);
    }
}


function getDirectories(fileService, successcb, errorcb) {
    getFileSystem(fileService, onInitFs, fsErrorHandler);

    function onInitFs(fs) {
        fileSystem = fs;
        console.log("Got file system: " + fs.name);
        fs.root.getDirectory(STORE_DIRECTORY, {
            create: true
        }, function (approot) {
            console.log("Got root directory: " + JSON.stringify(approot));
            approot.getDirectory(REMINDER_DIRECTORY, {
                create: true
            }, function (reminders) {
                console.log("Got reminder directory: " + JSON.stringify(reminders));
                approot.getDirectory(PLACE_DIRECTORY, {
                    create: true
                }, function (places) {
                    console.log("Got places directory: " + JSON.stringify(places));
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
        errorHandler(err);
        errorcb(err);
    }
}


function getFileService(successcb, errorcb) {
    console.log("get FileService");
    if (fileService !== null) {
        console.log("... already have FileService");
        successcb(fileService);
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
        console.log("found: " + service.serviceAddress);
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
                console.log("Bound service: " + boundService.serviceAddress);
                fileService = boundService;
                successcb(boundService);
            }
        });
    }

    find();

}


/* Shamelessly stolen from http://www.html5rocks.com/en/tutorials/file/filesystem/ */

function errorHandler(e) {
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
