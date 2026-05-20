#!/bin/bash
set -euxo pipefail

dnf update -y
dnf install -y docker
systemctl enable --now docker
usermod -aG docker ec2-user

mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-${compose_arch} \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

install -d -o ec2-user -g ec2-user /home/ec2-user/home-fit-ai
