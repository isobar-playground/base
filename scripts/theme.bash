#!/bin/bash

# Prompt for the theme name
read -p "Enter theme name [${1}]: " THEME_NAME
if [ -z "$THEME_NAME" ]; then
    THEME_NAME=$1
fi

echo "Using theme: $THEME_NAME"

# Generate the theme using Drupal CLI
docker compose --progress quiet --env-file .env --env-file .env.local run --rm php php web/core/scripts/drupal generate-theme "$THEME_NAME" --path themes/custom --starterkit base_starterkit

# Replace occurrences in files
sed -i "s|themes/custom/base_starterkit|themes/custom/$THEME_NAME|g" docker/node/Dockerfile
sed -i "s|themes/custom/base_starterkit|themes/custom/$THEME_NAME|g" compose.yml
sed -i "s|themes/custom/base_starterkit|themes/custom/$THEME_NAME|g" docker/php/Dockerfile
sed -i "s|themes/custom/base_starterkit|themes/custom/$THEME_NAME|g" .github/dependabot.yml

# Recreate node container
echo "Recreating node container..."
docker compose --progress quiet --env-file .env --env-file .env.local up -d node

# Install node dependencies
echo "Installing node dependencies..."
docker compose --progress quiet --env-file .env --env-file .env.local run --rm node npm i

# Enable new themeEnabling a new theme and set it as the default...
echo "Activate a new theme and set it as the default..."
docker compose --progress quiet --env-file .env --env-file .env.local run --rm php drush --quiet theme:install $THEME_NAME
docker compose --progress quiet --env-file .env --env-file .env.local run --rm php drush --quiet config-set system.theme default $THEME_NAME -y
