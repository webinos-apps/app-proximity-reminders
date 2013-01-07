#! /bin/sh

# This script also creates a signed widget.  However, it uses the tools available
# on https://github.com/paddybyers/widgetsigner rather than the w3c test suite
# tools.  This may be more useful if you do not use Linux.  The only prerequisite
# is Java (which must be in your PATH) and a set of valid certificates (see the other scripts).

# We need to configure this tool with the path to the Java signing tool
# Make sure that this has been compiled (by running ant) before using this
# script.
SIGNER=~/git-repos/widgetsigner/out/widgetsigner.jar

# Where are the author and distributor keys?
PWD=`pwd`
AUTHOR_P12=$PWD/example-certs/author.p12
AUTHOR_KEY_NAME=author.key.pem
AUTHOR_PASSWORD=secret
DISTRIBUTOR_P12=$PWD/example-certs/distributor.p12
DISTRIBUTOR_KEY_NAME=distributor.key.pem
DISTRIBUTOR_PASSWORD=secret

echo $DISTRIBUTOR_P12

# What are we signing?
WIDGET_PATH=$PWD/proximityreminder.wgt
WIDGET_NO_WEBINOSJS_PATH=$PWD/proximityreminder-nowebinosjs.wgt

echo "Creating example author signature...."
java -jar $SIGNER -w $WIDGET_PATH -k $AUTHOR_P12 -p $AUTHOR_PASSWORD -a $AUTHOR_KEY_NAME -s 0
java -jar $SIGNER -w $WIDGET_NO_WEBINOSJS_PATH -k $AUTHOR_P12 -p $AUTHOR_PASSWORD -a $AUTHOR_KEY_NAME -s 0

if [ $? -ne 0 ]; then
  echo "Failed to create and validate author signatures"
  exit 500
fi
echo "Done."

echo "Creating example distributor signature...."
java -jar $SIGNER -w $WIDGET_PATH -k $DISTRIBUTOR_P12 -p $DISTRIBUTOR_PASSWORD -a $DISTRIBUTOR_KEY_NAME -s 1
java -jar $SIGNER -w $WIDGET_NO_WEBINOSJS_PATH -k $DISTRIBUTOR_P12 -p $DISTRIBUTOR_PASSWORD -a $DISTRIBUTOR_KEY_NAME -s 1

if [ $? -ne 0 ]; then
  echo "Failed to create distributor signatures"
  exit 500
fi

echo "Done."
