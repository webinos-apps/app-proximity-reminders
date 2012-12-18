#! /bin/bash

# We need to configure this tool with the path to the W3C 'sign-widget.sh' 
# and 'validate-widget' tools.
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

# Create author signatures
$SIGNER --pkcs12 $AUTHOR_P12 --pwd $AUTHOR_PASSWORD -a -c $AUTHOR_X509 $WIDGET_PATH

# Create distributor signatures
$SIGNER --pkcs12 $DISTRIBUTOR_P12 --pwd $DISTRIBUTOR_PASSWORD -c $DISTRIBUTOR_X509 $WIDGET_PATH
