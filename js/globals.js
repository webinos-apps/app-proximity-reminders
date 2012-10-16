/* Sorry.  Really, really sorry */
//Just some names of DIVs
var STORE_DIRECTORY = "proximityreminder";
var REMINDER_DIRECTORY = "reminders";
var PLACE_DIRECTORY = "places";
var REMINDER_DIV_ID = "reminderDiv";
var PLACES_DIV_ID = "placesDiv";
var MAP_IMG_ID = "imgmap";
var MAP_DIV_ID = "map";
var VIEW_DIV_ID = "viewDiv";
var EDIT_DIV_ID = "editDiv";


// This I need to avoid reloading services.  Would be better as singletons
// TODO: Refactor!
var fileService = null;
var fileSystem = null;
var geoOnce = false;
var geoService = null;

var googleMapLoaded = false;

//I need this to keep track of my Google Map location
var editMap = null;

// These are actually useful, although also due a refactor.
var places;
var reminders;
