#! /bin/sh

if [ -e ./proximityreminder.wgt ]; then 
    rm -v proximityreminder.wgt
fi

zip proximityreminder.wgt *.html ./js/*.js ./css/*.css ./images/* config.xml remind_me.png

if [ -e ./proximityreminder-nowebinosjs.wgt ]; then 
    rm -v proximityreminder-nowebinosjs.wgt
fi

zip proximityreminder-nowebinosjs.wgt *.html ./js/*.js ./css/*.css ./images/* config.xml remind_me.png -x ./js/webinos.js
