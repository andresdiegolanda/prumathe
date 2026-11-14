# The edge of the course: Wrangler and workerd, the runtime of Workers, on this machine.
# The same image runs the lab command (docker compose run --rm lab ...).
FROM node:26.13.1-bookworm-slim@sha256:5df79989ed685e09f0a98019db4cebfb22fb9df1a53c0161664a011f7ff6b0f1
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates curl dnsutils \
 && rm -rf /var/lib/apt/lists/*
ENV WRANGLER_SEND_METRICS=false
# lab inside this container: the local tools of wrangler dev only answer to their own machine.
RUN printf '#!/bin/sh\nexec node /edge/lab/lab.mjs "$@"\n' > /usr/local/bin/lab && chmod +x /usr/local/bin/lab
WORKDIR /edge
RUN chown node:node /edge
USER node
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY --chown=node:node wrangler.jsonc tsconfig.json vitest.config.ts entrypoint.sh ./
COPY --chown=node:node migrations migrations
COPY --chown=node:node src src
COPY --chown=node:node test test
COPY --chown=node:node deploy deploy
COPY --chown=node:node lab lab
RUN mkdir .wrangler && npx wrangler types > /dev/null
EXPOSE 8787
ENTRYPOINT ["sh", "/edge/entrypoint.sh"]
