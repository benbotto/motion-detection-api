# A debian-base image is used for cloning the repository and installing the
# dependencies.
FROM node:dubnium AS build

WORKDIR /var/node

ARG TAG
ARG SSH_PRIVATE_KEY

# 1) An SSH key is needed to clone the motion-detection-api repoository, and
# github needs to be a known host so that ssh doesn't prompt for key
# verification.

# 2) The motion-detection-api repo is cloned, then the TAG is
# checked out.

# 3) Install the dependencies and build.

# 4) Remove dev dependencies and install prod.
RUN mkdir /root/.ssh/ && \
    echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa && \
    touch /root/.ssh/known_hosts && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts && \
    git clone git@github.com:benbotto/motion-detection-api.git . && \
    git checkout ${TAG} && \
    npm install && \
    npm run build && \
    rm -rf node_modules && \
    npm install --only=production

# An alpine image is used for the resulting image.  It has the built
# application and dependencies needed to run it, but not much else.  It does
# not contain the SSH key in the image's history.
FROM node:dubnium-alpine

WORKDIR /var/node

# This is used to wait for the database and amqp servers to come online.
COPY ./wait-for ./
RUN chmod +x ./wait-for

# Copy the production assets.
COPY --from=build ["/var/node/package.json", "./package.json"]
COPY --from=build ["/var/node/connections.json", "./connections.json"]
COPY --from=build ["/var/node/dist/", "./"]
COPY --from=build ["/var/node/node_modules", "./node_modules"]

RUN npm install -g forever

# The application runs under the node user.
USER node
EXPOSE 3000

# Wait for the database and MQ servers, then run the app.
CMD sh -c "./wait-for -t 600 ${MYSQL_HOST}:3306 -- ./wait-for -t 300 ${MQ_HOST}:${MQ_PORT} -- forever main.js"
