#!/usr/bin/env sh

# Wait for Docker daemon to run.
while [ -z "$(docker info -f json | jq -r .ID)" ]; do sleep 1; done

# Override composer configuration for codespaces.
cp codespaces.compose.override.yml compose.override.yml
touch .env.local
echo "PROJECT_BASE_URL=${CODESPACE_NAME}-80.app.github.dev" >> .env.local
echo "PROJECT_PORT=443" >> .env.local

# Spin-up environment, install dependencies
make

# Set ports public by default.

gh codespace ports visibility 80:public -c $CODESPACE_NAME
gh codespace ports visibility 6006:public -c $CODESPACE_NAME

echo "Access Drupal at https://${CODESPACE_NAME}-80.app.github.dev"
echo "Access Storybook at https://${CODESPACE_NAME}-6006.app.github.dev"
