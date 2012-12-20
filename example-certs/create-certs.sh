#! /bin/bash

# First, some configuration
SUBJECT_NAME="/CN=TheAuthorsName/C=UK/ST=England/O=WebinosConsortium/OU=AppDevelopment"
PASSWORD=secret

# Create the author key
openssl genrsa -out author.key.pem 2048
# Create a self-signed certificate for that key
openssl req -batch -new -x509 -days 7300 -key author.key.pem -out author.cert.pem -subj $SUBJECT_NAME
# Turn the key and certificate into PKCS12 file format
openssl pkcs12 -passin pass:$PASSWORD -passout pass:$PASSWORD -export -in ./author.cert.pem -inkey author.key.pem -name author.key.pem -out author.p12

# Create a distributor key (exactly the same steps as for an author)
openssl genrsa -out distributor.key.pem 2048
# Create a self-signed certificate for that key
openssl req -batch -new -x509 -days 7300 -key distributor.key.pem -out distributor.cert.pem -subj $SUBJECT_NAME
# Turn the key and certificate into PKCS12 file format
openssl pkcs12 -passin pass:$PASSWORD -passout pass:$PASSWORD -export -in ./distributor.cert.pem -inkey distributor.key.pem -name distributor.key.pem -out distributor.p12


