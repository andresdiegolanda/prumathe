#!/bin/sh
set -eu
printf 'OrderPlaced from the file source at %s\n' "$(date -u +%FT%TZ)" >> /data/input.txt
printf 'One line appended. / Se agregó una línea.\n'
