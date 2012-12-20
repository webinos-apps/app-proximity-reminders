app-proximity-reminders
======================

A webinos app for creating reminders based on where you are and what time it is.

To make the application into a widget, simply zip the contents of the 
repository.  You can also (for convenience) use the included shell scripts:

 * create-widget.sh will create the widget package
 * create-signatures.sh will sign the widget using example author and distributor
   signatures held in the example-certs directory
 * create-signed-widget.sh creates a packaged, signed widget.  It just calls the
   other two scripts.

Warning: at present this doesn't work on Chrome because Chrome doesn't support
the FileAPI if the webpage is loaded over the file:// protocol.

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





