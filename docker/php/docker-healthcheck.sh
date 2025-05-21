#!/bin/sh
set -e

echo "Checking if process 1 is php-fpm..."
PROCESS_NAME=$(cat /proc/1/comm 2>/dev/null || echo "unknown")
echo "Process 1 name: $PROCESS_NAME"

if [ "$PROCESS_NAME" = "php" ]; then
  echo "Checking if PHP is running in CLI mode..."

  if php -r 'exit(PHP_SAPI === "cli" ? 0 : 1);'; then
    echo "PHP is running in CLI mode. Exiting with status 0."
    exit 0
  fi
else
    echo "Process different from PHP is running. Exiting with status 0."
    exit 0
fi

echo "Sending GET request to FastCGI (127.0.0.1:9000)..."
if env -i REQUEST_METHOD=GET SCRIPT_NAME=/ping SCRIPT_FILENAME=/ping cgi-fcgi -bind -connect 127.0.0.1:9000; then
  echo "FastCGI responded successfully. Exiting with status 0."
  exit 0
else
  echo "FastCGI health check failed. Exiting with status 1."
fi

exit 1
