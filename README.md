webinos Proximity Reminders
===========================

A webinos app for creating reminders based on where you are and what time it is.

Use it to set up a reminder for a certain time - e.g., an appointment - or for
when you are in a certain place - e.g., buying food when near a supermarket.


Creating a widget
=================

To make the application into a widget, simply zip the contents of the
repository.  You can also (for convenience) use the included shell scripts:

 * create-widget.sh will create the widget package
 * create-signatures.sh will sign the widget using example author and distributor
   signatures held in the example-certs directory
 * create-signed-widget.sh creates a packaged, signed widget.  It just calls the
   other two scripts.

Using this application
======================

This application assumes you are running webinos version 0.7.0 or greater.  For
more information about the webinos project, visit webinos/Webinos-Platform .

You can either load the widget from the .wgt file (see the previous section)
or you can run index.html from a suitably modern web browser, such as Firefox
or Chrome.  If you run from a browser, you may need to replace the 'webinos.js'
file with a more recent version from the webinos project.

After the application loads, click on 'Create a reminder' to add a new
reminder, and then fill in the necessary details.  You can select both a time
and location or neither.  You can also select which of the devices in your
personal zone you would like to remind.  New locations can be created by
clicking on the 'Add a new location' option.  This will bring up a Google Maps
box which you can use to select the place of interest.

Existing reminders and locations can be edited or deleted by clicking "View
reminders" and then clicking on the reminder or place in question.

Reminders will not be checked automatically unless you tick the 'Check
reminders' box.  Once triggered, the reminder will pop up a box and invoke the
Web Notification API.  When this is cancelled, the reminder will set itself to
'disabled' so that it is not triggered again.

Data structures
===============

Reminders are stored as JSON objects in individual files using the webinos
implementation of the W3C File API.  For simplicity we have not used any
existing calendar format.  Reminders have the following structure:

    {
      "id": "reminder-1358433751941",
      "enabled": true,
      "description": "Test reminder",
      "when": {
        "startdate": "2013-01-17T14:42:00.000Z",
        "enddate": "2013-01-24T10:42:00.000Z",
        "recurring": null
      },
      "where": [
        {
          "place": "place-1358433751941"
          },
          "proximity": {
            "amount": "1000",
            "units": "metres"
          }
        }
      ],
      "devices": [
        {
          "id": "d9f83a1cb85165d3a2f23e6b95840795",
          "api": "http:\/\/webinos.org\/api\/notifications",
          "displayName": "Web Notification",
          "description": "Web Notification API",
          "serviceAddress": "..."
        }
      ]
    }

Note that many of these fields are optional.  The intention is to allow for
multiple locations.  However, the UI currently only supports a maximum of one
location per reminder.

Similarly, places are stored in individual files and have the following
structure:

    {
      "id": "place-1358433751941",
      "datecreated": "2013-01-17T14:42:31.941Z",
      "description": "Oxford",
      "coordinates": {
        "latitude": 51.752391113402,
        "longitude": -1.2556648254394
      }
    }


Code structure
==============

The application has one HTML page - index.html - plus a lot of javascript and
CSS.

The application is split into the following javascript components:

 * main.js - initialises the application and maintains the application's
   state (the set of reminders and locations).
 * alertreminder.js - triggers the checking of reminders (through the
   checkInterval function) and display of notifications through a HTML pop-up
   as well as the Notification API.
 * editreminder.js - displays and populates the 'edit reminder' screen.
 * findreminder.js - the logic that decides whether a particular reminder should
   be triggered at any time.
 * geoTools.js - contains geolocation methods such as invoking the geolocation
   API through webinos and loading the google maps scripts.
 * globals.js - references to fixed DIV names that are used in the main code
 * storereminders.js - uses the File API to store and load reminders from the
   file system.
 * viewreminders.js - populates the 'view reminders' page.
 * webinos.js - a copy of the generated webinos.js script, required when running
   in the browser.

It also makes heavy use of jquery and an add-on for showing a date and time
picker.

License
=======

All source code and content created by members of the webinos project is
released with the APACHE 2.0 license (see the LICENSE file).

We have included other modules not created by the webinos project
with different licenses.  This includes:

 * jquery and jquery-UI files which are under the MIT license -
   http://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt
 * js/jquery-ui-timepicker-addon.js -
   http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
 * css/jquery-ui-timepicker-addon.css -
   http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
 * The OpenSans fonts, which have an Apace 2.0 license -
   http://www.google.com/webfonts/specimen/Open+Sans

There are a couple of other trivial code snippets in this application, the
copyright for these lies with the original author.
