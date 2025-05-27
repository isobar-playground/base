#!/usr/bin/env sh

# Install Taskfile
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b ~/.local/bin

# Wait for Docker daemon to run.
while [ -z "$(docker info -f json | jq -r .ID)" ]; do sleep 1; done

# Setup environment
task init:codespaces
