#! /bin/sh

if [ -e ./proximityreminder.wgt ]; then 
    rm -v proximityreminder.wgt
fi

# Zip all the html, javascript, CSS, images and other information.
zip -r proximityreminder.wgt *.html ./js/*.js ./css/* config.xml remind_me.png -x *~ -x */*~

if [ -e ./proximityreminder-nowebinosjs.wgt ]; then 
    rm -v proximityreminder-nowebinosjs.wgt
fi

# Do it again, but this time without webinos.js
zip -r proximityreminder-nowebinosjs.wgt *.html ./js/*.js ./css/* config.xml remind_me.png -x ./js/webinos.js -x *~ -x */*~
