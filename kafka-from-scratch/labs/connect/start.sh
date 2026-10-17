#!/bin/sh
set -eu
mkdir -p /data
touch /data/input.txt
exec /opt/kafka/bin/connect-standalone.sh /course/connect/worker.properties /course/connect/source.properties
