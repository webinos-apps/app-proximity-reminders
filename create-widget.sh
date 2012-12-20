#! /bin/sh

if [ -e ./proximityreminder.wgt ]; then 
    rm -v proximityreminder.wgt
fi

# Zip all the html, javascript, CSS, images and other information.
zip proximityreminder.wgt *.html ./js/*.js ./css/*.css ./css/images/* config.xml remind_me.png

if [ -e ./proximityreminder-nowebinosjs.wgt ]; then 
    rm -v proximityreminder-nowebinosjs.wgt
fi

# Do it again, but this time without webinos.js
zip proximityreminder-nowebinosjs.wgt *.html ./js/*.js ./css/*.css ./css/images/* config.xml remind_me.png -x ./js/webinos.js
