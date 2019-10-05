FROM node:dubnium as build

WORKDIR /var/node

ARG TAG
ARG SSH_PRIVATE_KEY

# 1) An SSH key is needed to clone the motion-detection-api repoository, and
# github needs to be a known host so that ssh doesn't prompt for key
# verification.

# 2) The motion-detection-api repo is cloned, then the TAG is
# checked out.

# 3) Install the formn-cli.
RUN mkdir /root/.ssh/ && \
    echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa && \
    touch /root/.ssh/known_hosts && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts && \
    git clone git@github.com:benbotto/motion-detection-api.git . && \
    git checkout ${TAG} && \
    npm install formn-cli@1.x.x

# An alpine image is used to run the migrations.  It's small and the
# ssh key is not included in the image's history.
FROM node:dubnium-alpine

WORKDIR /var/node

# These env vars are required for running migrations (see
# connections.migrate.json).
ENV MYSQL_HOST=127.0.0.1
ENV MYSQL_ROOT_PASSWORD=bad-password
ENV MYSQL_DATABASE=motion_detection

# This is used to wait for the database to come online.
COPY ./wait-for ./
RUN chmod +x ./wait-for

COPY --from=build ["/var/node/connections.migrate.json", "./connections.migrate.json"]
COPY --from=build ["/var/node/node_modules", "./node_modules"]
COPY --from=build ["/var/node/migrations", "./migrations"]

# Wait for the database to come online, then migrate up.
CMD sh -c "./wait-for ${MYSQL_HOST}:3306 -- npx formn m -c ./connections.migrate.json up"
