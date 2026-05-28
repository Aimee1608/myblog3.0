#!/usr/bin/env bash
# Build the image locally, ship it to the ECS host, and (re)start the container.
# The ECS box only has 2GB RAM, so we never build there: build here, save, scp, load.
#
# Usage: ./deploy.sh [tag]
#   tag defaults to a timestamp.
#
# Prereqs on ECS (one-time): /root/myblog3.env exists (see myblog3.env.example),
# MongoDB runs on 127.0.0.1:27017, and nginx reverse-proxies mangoya.cn -> 127.0.0.1:3000.
set -euo pipefail

TAG="${1:-$(date +%Y%m%d-%H%M)}"
IMAGE="myblog3:${TAG}"
REMOTE="myblog"          # ssh alias configured in ~/.ssh/config
ARCHIVE="/tmp/myblog3_${TAG}.tar.gz"

echo "==> [1/5] Building ${IMAGE} locally"
sudo docker build --build-arg NPM_REGISTRY=https://registry.npmmirror.com -t "${IMAGE}" .

echo "==> [2/5] Saving image to ${ARCHIVE}"
sudo docker save "${IMAGE}" | gzip > "${ARCHIVE}"
ls -lh "${ARCHIVE}"

echo "==> [3/5] Uploading to ECS (${REMOTE})"
scp "${ARCHIVE}" "${REMOTE}:/tmp/"

echo "==> [4/5] Loading & (re)starting container on ECS"
# host network: the container reaches MongoDB at 127.0.0.1:27017 directly and
# Next listens on 127.0.0.1:3000 (HOSTNAME in myblog3.env), which nginx proxies.
ssh "${REMOTE}" "
  set -e
  docker load < ${ARCHIVE}
  docker rm -f myblog3 2>/dev/null || true
  docker run -d --name myblog3 --restart=always \
    --network=host \
    --env-file /root/myblog3.env \
    --memory=350m \
    -v /www/wwwroot/myblog-uploads:/app/public/posts-images \
    ${IMAGE}
  docker image prune -f >/dev/null 2>&1 || true
  rm -f ${ARCHIVE}
"

echo "==> [5/5] Cleaning up local archive"
rm -f "${ARCHIVE}"

echo "==> Done. Deployed ${IMAGE}. Check: ssh ${REMOTE} 'docker logs --tail=30 myblog3'"
