#!/bin/sh
set -e

# Simple env substitution function, loosely based on NGINX version
# @see https://github.com/nginx/docker-nginx/blob/master/entrypoint/20-envsubst-on-templates.sh
fpm_env_subst() {
  # shellcheck disable=SC3043
  local defined_envs
  # shellcheck disable=SC3043
  local filter="${ENVSUBST_FILTER:-FPM_PM_}"
  # shellcheck disable=SC2016
  # shellcheck disable=SC2046
  defined_envs=$(printf '${%s} ' $(awk "END { for (name in ENVIRON) { print ( name ~ /${filter}/ ) ? name : \"\" } }" < /dev/null ))

  envsubst "$defined_envs" < "/usr/local/etc/php-fpm.d/zz-docker.conf.template" > "/usr/local/etc/php-fpm.d/zz-docker.conf"
}

# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
	set -- php-fpm "$@"
fi

if [ "$1" = 'php-fpm' ] || [ "$1" = 'php' ] || [ "$1" = 'bin/console' ]; then
	PHP_INI_RECOMMENDED="$PHP_INI_DIR/php.ini-production"
	if [ "$APP_ENV" != 'prod' ]; then
		PHP_INI_RECOMMENDED="$PHP_INI_DIR/php.ini-development"
	fi
	ln -sf "$PHP_INI_RECOMMENDED" "$PHP_INI_DIR/php.ini"
	fpm_env_subst

#	mkdir -p var/cache var/logs
#
#	if [ "$APP_ENV" != 'prod' ]; then
#		setfacl -R -m u:www-data:rwX -m u:"$(whoami)":rwX var
#		setfacl -dR -m u:www-data:rwX -m u:"$(whoami)":rwX var
#	fi
fi

exec docker-php-entrypoint "$@"
