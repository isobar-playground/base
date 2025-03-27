#!/bin/bash

set -e

# Prompt for the theme name
read -p "Enter theme name [${1}]: " THEME_NAME
if [ -z "$THEME_NAME" ]; then
    THEME_NAME=$1
fi

echo "Using theme: $THEME_NAME"

# Remove node_modules in base_starterkit
rm -r html/web/themes/custom/base_starterkit/node_modules

# Generate the theme using Drupal CLI
docker compose --progress quiet --env-file .env --env-file .env.local run --rm php php web/core/scripts/drupal generate-theme "$THEME_NAME" --path themes/custom --starterkit base_starterkit

# Convert underscores to dashes for twig files based on THEME_NAME
THEME_NAME_TWIG=$(echo "$THEME_NAME" | sed 's/_/-/g')

# Rename files in the templates directory (including nested directories)
find html/web/themes/custom/$THEME_NAME/templates -type f -name "*base-starterkit*" | while read file; do
    # For twig files, replace "base-starterkit" with THEME_NAME_TWIG.
    # For other files, replace "base-starterkit" with THEME_NAME as is.
    if [[ "$file" == *.twig ]]; then
        newfile=$(echo "$file" | sed "s/base-starterkit/$THEME_NAME_TWIG/g")
    else
        newfile=$(echo "$file" | sed "s/base-starterkit/$THEME_NAME/g")
    fi
    # Ensure that the target directory exists before renaming
    newdir=$(dirname "$newfile")
    mkdir -p "$newdir"
    echo "Renaming: $file -> $newfile"
    mv "$file" "$newfile"
done

# Replace occurrences in files
sed -i '' "s|themes/custom/base_starterkit|themes/custom/$THEME_NAME|g" docker/node/Dockerfile
sed -i '' "s|themes/custom/base_starterkit|themes/custom/$THEME_NAME|g" compose.yml
sed -i '' "s|themes/custom/base_starterkit|themes/custom/$THEME_NAME|g" docker/php/Dockerfile
sed -i '' "s|themes/custom/base_starterkit|themes/custom/$THEME_NAME|g" .github/dependabot.yml

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
