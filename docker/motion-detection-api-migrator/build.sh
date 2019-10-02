#!/bin/bash

if [ "$1" = "" ]
then
  echo "Usage: $0 <tag>"
  exit 1
fi

TAG=$1

# Cleanup.
docker rmi avejidah/motion-detection-api-migrator:latest 2>/dev/null

# Build, tagging as latest.
docker build \
  --build-arg SSH_PRIVATE_KEY="$(<~/.ssh/id_rsa)" \
  --build-arg TAG="${TAG}" \
  --no-cache \
  -t avejidah/motion-detection-api-migrator:latest .

# Push latest.
docker push avejidah/motion-detection-api-migrator:latest

# Tag with a tag matching the code repository.
docker tag avejidah/motion-detection-api-migrator:latest \
  avejidah/motion-detection-api-migrator:${TAG}
docker push avejidah/motion-detection-api-migrator:${TAG}
