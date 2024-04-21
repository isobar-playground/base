
# URLs and files
local_file=".env"
remote_url="https://raw.githubusercontent.com/wodby/docker4drupal/master/.env"

# Temporary files
remote_temp=$(mktemp)
local_temp=$(mktemp)
remote_temp_excluded=$(mktemp)
local_temp_excluded=$(mktemp)

# Download the remote file
curl -sL "$remote_url" -o "$remote_temp"

# Remove lines 1 to 19 from both files
sed '1,19d' "$local_file" > "$local_temp_excluded"
sed '1,19d' "$remote_temp" > "$remote_temp_excluded"

# Use diff to find differences and apply changes
diff_output=$(diff -u "$local_temp_excluded" "$remote_temp_excluded")

# Apply the changes to the local file
patch "$local_file" -o "$local_file.patched" <<EOF
$diff_output
EOF

# Replace the local file with the patched file
mv "$local_file.patched" "$local_file"

# Clean up temporary files
rm "$remote_temp" "$local_temp" "$remote_temp_excluded" "$local_temp_excluded"