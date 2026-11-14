#!/bin/sh
# Test certificates of the course, made when the image is built: a test CA, the origin's
# certificate signed by it, and a self-signed one for the impostor. The CA's private key is
# deleted at the end, so it never travels in the image. Test material: trust it nowhere else.
set -e
DIR=${1:-/tls}
P=rumbo-lab
mkdir -p "$DIR" && cd "$DIR"
keytool -genkeypair -alias ca -keyalg EC -groupname secp256r1 -dname "CN=Rumbo course test CA" -ext bc:c -validity 3650 -keystore ca.p12 -storetype PKCS12 -storepass $P
keytool -exportcert -rfc -alias ca -keystore ca.p12 -storepass $P > ca.pem
keytool -genkeypair -alias origin -keyalg EC -groupname secp256r1 -dname "CN=origin" -validity 3650 -keystore origin.p12 -storetype PKCS12 -storepass $P
keytool -certreq -alias origin -keystore origin.p12 -storepass $P | keytool -gencert -alias ca -keystore ca.p12 -storepass $P -ext san=dns:origin -validity 3650 -rfc > origin.pem
keytool -importcert -noprompt -alias ca -file ca.pem -keystore origin.p12 -storepass $P
keytool -importcert -alias origin -file origin.pem -keystore origin.p12 -storepass $P
keytool -genkeypair -alias impostor -keyalg EC -groupname secp256r1 -dname "CN=origin" -ext san=dns:origin,dns:impostor -validity 3650 -keystore impostor.p12 -storetype PKCS12 -storepass $P
rm ca.p12 origin.pem
