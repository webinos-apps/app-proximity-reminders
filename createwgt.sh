#! /bin/sh

if [ -e ./proximityreminder.wgt ]; then 
    rm -v proximityreminder.wgt
fi

zip proximityreminder.wgt *.html *.js *.css config.xml remind_me.png
