FROM node:24.22.0-alpine@sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f
WORKDIR /srv
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-fund --no-audit && npm cache clean --force
COPY server.mjs ./
# The events volume of the live viewer is mounted here; a new volume takes this mode.
RUN mkdir -m 1777 /events
USER node
EXPOSE 8080
CMD ["node", "server.mjs"]
