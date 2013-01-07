#! /bin/sh

# We need to configure this tool with the path to the W3C 'sign-widget.sh' 
# and 'validate-widget' tools.  Instructions on obtaining these can be found
# on developer.webinos.org, or read the README file.
SIGNER=~/cvs-repos/2006/waf/widgets-digsig/test-suite/tools/sign-widget.sh
VALIDATOR=~/cvs-repos/2006/waf/widgets-digsig/test-suite/tools/validate-widget.sh

# Where are the author and distributor keys?
PWD=`pwd`
AUTHOR_P12=$PWD/example-certs/author.p12
AUTHOR_X509=$PWD/example-certs/author.cert.pem
AUTHOR_PASSWORD=secret
DISTRIBUTOR_P12=$PWD/example-certs/distributor.p12
DISTRIBUTOR_X509=$PWD/example-certs/distributor.cert.pem
DISTRIBUTOR_PASSWORD=secret

# What are we signing?
WIDGET_PATH=$PWD/proximityreminder.wgt
WIDGET_NO_WEBINOSJS_PATH=$PWD/proximityreminder-nowebinosjs.wgt

if [! -f ./example-certs/author.p12 ]; then
  echo "Missing author certificates, see the 'example-certs' directory"
  exit 500
fi


echo "--------------------------------------"
echo "  Creating example author signature   "
echo "--------------------------------------"
$SIGNER --pkcs12 $AUTHOR_P12 --pwd $AUTHOR_PASSWORD -a -c $AUTHOR_X509 -o author-signature.xml $WIDGET_PATH 
$SIGNER --pkcs12 $AUTHOR_P12 --pwd $AUTHOR_PASSWORD -a -c $AUTHOR_X509 -o author-signature.xml $WIDGET_NO_WEBINOSJS_PATH

if [ $? -ne 0 ]; then
  echo "Failed to create and validate author signatures"
  exit 500
fi

if [! -f ./example-certs/distributor.p12 ]; then
  echo "Missing distributor certificates, see the 'example-certs' directory"
  exit 500
fi


cd $PWD

echo "--------------------------------------"
echo "Creating example distributor signature"
echo "--------------------------------------"
$SIGNER --pkcs12 $DISTRIBUTOR_P12 --pwd $DISTRIBUTOR_PASSWORD -x -c $DISTRIBUTOR_X509 -o signature1.xml $WIDGET_PATH 
$SIGNER --pkcs12 $DISTRIBUTOR_P12 --pwd $DISTRIBUTOR_PASSWORD -x -c $DISTRIBUTOR_X509 -o signature1.xml $WIDGET_NO_WEBINOSJS_PATH

if [ $? -ne 0 ]; then
  echo "Failed to create distributor signatures"
  exit 500
fi

