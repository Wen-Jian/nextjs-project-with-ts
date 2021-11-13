#!/bin/sh
# remove existed images
OLD_IMAGE="$(docker images | grep demo)"

if ["$OLD_IMAGE" = ""]
then 
    echo "no image existed"
else
    echo "$OLD_IMAGE"
    docker rmi demo
fi

version=$(date +"%Y%m%d%S")

# build docker image
docker build . -t demo:$version
