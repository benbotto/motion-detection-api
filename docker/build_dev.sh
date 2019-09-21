#!/bin/bash

docker rmi us.gcr.io/project-bgi/dispatch-api-dev:latest
docker build \
  --no-cache \
  -t us.gcr.io/project-bgi/dispatch-api-dev:latest \
  -f Dockerfile.dev .

docker push us.gcr.io/project-bgi/dispatch-api-dev:latest