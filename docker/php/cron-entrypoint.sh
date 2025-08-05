#!/bin/sh
set -e

printenv | sed 's/^/export /' >> /home/php/.profile

crontab -u php /home/php/crontab

cron -f
