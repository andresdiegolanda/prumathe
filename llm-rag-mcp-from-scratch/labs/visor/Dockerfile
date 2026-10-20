FROM node:24.22.0-alpine@sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f
WORKDIR /srv
COPY server.mjs ./
COPY static ./static
# The events volume is mounted here; a new volume takes this mode, so every image can write it.
RUN mkdir -m 1777 /events
USER 10001:10001
EXPOSE 18093
CMD ["node", "server.mjs"]
