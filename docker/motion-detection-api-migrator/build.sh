#!/bin/bash

if [ "$1" = "" ]
then
  echo "Usage: $0 <tag>"
  exit 1
fi

TAG=$1

# Build, tagging as latest-arm.
docker build \
  --build-arg SSH_PRIVATE_KEY="$(<~/.ssh/id_rsa)" \
  --build-arg TAG="${TAG}" \
  -t avejidah/motion-detection-api-migrator:latest-arm .

# Push latest-arm.
docker push avejidah/motion-detection-api-migrator:latest-arm

# Tag with a tag matching the code repository.
docker tag avejidah/motion-detection-api-migrator:latest-arm \
  avejidah/motion-detection-api-migrator:${TAG}-arm
docker push avejidah/motion-detection-api-migrator:${TAG}-arm
