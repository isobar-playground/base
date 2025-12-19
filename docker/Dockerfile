# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact

# Name of app
ARG APP_BASE="base"

# Additional packages
ARG XLSWRITER_VERSION=1.5.2
ARG MEMCACHED_VERSION=3.3.0
ARG SQLSRV_VERSION=5.10.1
ARG USE_XDEBUG=0

# PHP 7.4
#ARG XDEBUG_VERSION=3.1.6
#FROM php:7.4-fpm AS php

# PHP 8.3
ARG XDEBUG_VERSION=3.4.2
FROM php:8.3.29-fpm-bookworm AS php

FROM php AS php-extensions

ARG XLSWRITER_VERSION
ARG MEMCACHED_VERSION
ARG SQLSRV_VERSION
ARG XDEBUG_VERSION
ARG USE_XDEBUG

## Extension libraries
#### MSODBC version from Ubuntu 22.04 used due to https://github.com/microsoft/linux-package-repositories/issues/36#issuecomment-1441896422
#### It SHOULD be https://packages.microsoft.com/config/debian/${DEBIAN_VERSION}/prod.list instead of Ubuntu.
### Memcached - requires additional libraries as per https://serverfault.com/a/1136017
RUN set -eux; \
    curl https://packages.microsoft.com/keys/microsoft.asc > /usr/share/keyrings/microsoft.asc; \
    curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list \
      | sed -E "s/(\[)(.*)(\])/\1\2 signed-by=\/usr\/share\/keyrings\/microsoft.asc\3/" \
      > /etc/apt/sources.list.d/mssql-release.list; \
    apt-get update; \
    ACCEPT_EULA=Y \
    apt-get install -y \
      acl \
      bash \
      git \
      zip \
      software-properties-common \
      firebird-dev \
      libfreetype6-dev \
      libicu-dev \
      libjpeg62-turbo-dev \
      libmemcached-dev \
      libpng-dev \
      libwebp-dev \
      libssl-dev \
      libxml2-dev \
      libzip-dev \
      unixodbc-dev \
      zlib1g-dev;

## Configure PHP Extensions
RUN set -eux; \
    docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp; \
    pecl install memcached-${MEMCACHED_VERSION} xlswriter-${XLSWRITER_VERSION} sqlsrv-${SQLSRV_VERSION} pdo_sqlsrv-${SQLSRV_VERSION}; \
    docker-php-ext-configure intl; \
    docker-php-ext-configure pcntl --enable-pcntl;

## Compile PHP Extensions
RUN set -eux; \
    docker-php-ext-install -j$(nproc) \
    gd \
    intl \
    pcntl \
    pdo \
    pdo_firebird \
    pdo_mysql \
    soap \
    sockets \
    zip;

## Install Xdebug when required
RUN set -eux; \
    if [ "${USE_XDEBUG}" = "1" ]; then \
        pecl install xdebug-${XDEBUG_VERSION}; \
        echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
        echo "xdebug.start_with_request=trigger" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
        echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
    fi;

FROM php AS base

# PHP user and gid
ARG UID=1000

RUN set -eux; \
    curl https://packages.microsoft.com/keys/microsoft.asc > /usr/share/keyrings/microsoft.asc; \
    curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list \
      | sed -E "s/(\[)(.*)(\])/\1\2 signed-by=\/usr\/share\/keyrings\/microsoft.asc\3/" \
      > /etc/apt/sources.list.d/mssql-release.list; \
    apt-get update; \
    ACCEPT_EULA=Y \
    apt-get install -y \
      acl \
      bash \
      cron \
      default-mysql-client \
      gettext-base \
      git \
      libfbclient2 \
      libfcgi-bin \
      libfreetype6 \
      libjpeg62-turbo \
      libmemcached11 \
      libmemcachedutil2 \
      libpng16-16 \
      libzip4 \
      msodbcsql18 \
      nano \
      wkhtmltopdf \
      zip \
      ; \
  apt-get autoremove -y; \
  apt-get clean -y; \
  rm -rf /var/lib/apt/lists/*;

COPY --from=php-extensions /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
RUN set -eux; \
    docker-php-ext-enable \
    gd \
    intl \
    memcached \
    pcntl \
    pdo \
    pdo_firebird \
    pdo_mysql \
    pdo_sqlsrv \
    soap \
    sockets \
    sqlsrv \
    xlswriter \
    zip

# Create non-root user with UID and GID 1000
RUN addgroup --gid ${UID} php; \
    adduser --uid ${UID} --gid ${UID} --disabled-password --gecos "" php

RUN chown -R php:php $PHP_INI_DIR && \
    chown -R php:php ${PHP_INI_DIR}-fpm.d

COPY docker/php/crontab /home/php/crontab
COPY ./docker/php/cron-entrypoint.sh /usr/local/bin/cron-entrypoint
RUN chmod +x /usr/local/bin/cron-entrypoint

RUN ln -s $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
## https://getcomposer.org/doc/03-cli.md#composer-allow-superuser
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PATH="${PATH}:/root/.composer/vendor/bin:/home/php/app/html/vendor/bin:/srv/app/vendor/bin"

COPY ./docker/php/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint
ENTRYPOINT ["docker-entrypoint"]
CMD ["php-fpm"]

COPY ./docker/php/docker-healthcheck.sh /usr/local/bin/docker-healthcheck
RUN chmod +x /usr/local/bin/docker-healthcheck

HEALTHCHECK --interval=10s --timeout=3s --retries=3 --start-period=30s CMD ["docker-healthcheck"]

### Theme builder
FROM node:22.20.0 AS node

# Switch to non-root user for remaining operations
USER node

COPY --chown=node:node html/web/themes/custom/base_starterkit /srv/app/web/themes/custom/base_starterkit

WORKDIR /srv/app/web/themes/custom/base_starterkit

## Specific build steps required for theme, e.g. npm modules install, gulp tasks etc.
RUN npm ci; \
    npm run build;

FROM ${APP_BASE} AS app_php
## FPM config variables
ENV FPM_PM_MAX_CHILDREN="${FPM_PM_MAX_CHILDREN:-50}"
ENV FPM_PM_START_SERVERS="${FPM_PM_START_SERVERS:-4}"
ENV FPM_PM_MIN_SPARE_SERVERS="${FPM_PM_MIN_SPARE_SERVERS:-2}"
ENV FPM_PM_MAX_SPARE_SERVERS="${FPM_PM_MAX_SPARE_SERVERS:-6}"
ENV FPM_PM_MAX_REQUESTS="${FPM_PM_MAX_REQUESTS:-100}"

# Default application environment should be PROD
ENV APP_ENV="prod"
ENV SYMFONY_ENV="prod"

COPY ./docker/php/conf.d/symfony.${SYMFONY_ENV}.ini $PHP_INI_DIR/conf.d/symfony.ini

# Override PHP settings for PHP-FPM - in www mode we want to have different memory limits and so on:
COPY ./docker/php/php-fpm.d/zz-docker.conf.template /usr/local/etc/php-fpm.d/zz-docker.conf.template
COPY ./docker/php/php-fpm.d/zzz-app.conf /usr/local/etc/php-fpm.d/zzz-app.conf

ARG USE_XDEBUG

RUN set -eux; \
    if [ "${USE_XDEBUG}" = "1" ]; then \
        docker-php-ext-enable xdebug; \
    fi;

# Switch to non-root user for remaining operations
USER php

# Copy HTML directory with user and group ownership set to 1000
COPY --chown=php:php ./html /srv/app
COPY --from=node /srv/app/web/themes/custom/base_starterkit /srv/app/web/themes/custom/base_starterkit
WORKDIR /srv/app

RUN SET -eux; \
    mkdir -p var/cache var/logs; \
    composer install --prefer-dist --no-dev --optimize-autoloader --no-ansi --no-progress --no-scripts --no-interaction; \
    sync; \
    setfacl -R -m u:www-data:rwX -m u:"$(whoami)":rwX var; \
    setfacl -dR -m u:www-data:rwX -m u:"$(whoami)":rwX var;

## Webserver ###

FROM httpd:2.4 AS apache

WORKDIR /srv/app

COPY --from=app_php /srv/app .
COPY --from=node /srv/app/web/ ./web/

COPY ./docker/apache/templates/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./docker/apache/templates/common.conf /usr/local/apache2/conf/conf.d/common.conf
COPY ./docker/apache/templates/vhosts.conf /usr/local/apache2/conf/conf.d/vhosts.conf

EXPOSE 80

CMD ["httpd-foreground"]

FROM app_php AS grumphp

COPY --from=node /usr/local /usr/local

ENV PATH=$PATH:/home/php/app/html/web/core/node_modules/.bin

# Switch back to php user
USER php
