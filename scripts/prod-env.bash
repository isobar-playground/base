#!/bin/bash

touch .env.local

while IFS= read -r line; do
    [[ $line == \#* ]] && continue
    if [[ $line == *"-dev-"* ]]; then
        key=$(echo "$line" | cut -d'=' -f1)
        new_value=$(echo "$line" | sed 's/-dev-/-/')
        if grep -q "^$key=" .env.local; then
            sed -i "s|^$key=.*|$new_value|" .env.local
        else
            echo "$new_value" >> .env.local
        fi
    fi
done < .env
