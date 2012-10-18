#! /bin/sh

if [ -e ./proximityreminder.wgt ]; then 
    rm -v proximityreminder.wgt
fi

zip proximityreminder.wgt *.html ./js/*.js ./css/*.css ./images/* config.xml remind_me.png
