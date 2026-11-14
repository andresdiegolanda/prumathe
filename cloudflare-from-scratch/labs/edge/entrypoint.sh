#!/bin/sh
# Starts the edge: the D1 migrations on the local database first, then wrangler dev. The live
# viewer of the kit, when its folder is mounted, runs next to it and reads its spans on 127.0.0.1.
set -e
npx wrangler d1 migrations apply rumbo-edge --local
if [ -f /visor/server.mjs ]; then node /visor/server.mjs & fi
exec npx wrangler dev --ip 0.0.0.0 --port 8787 --show-interactive-dev-session=false
