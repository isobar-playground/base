ARG PHP_TAG
ARG NODE_IMAGE

FROM ${NODE_IMAGE:-latest} AS node

FROM wodby/drupal-php:${PHP_TAG:-latest}

COPY --chown=wodby html /var/www/html

RUN composer install

COPY --chown=wodby --from=node /var/www/html/web/themes/custom/base_starterkit /var/www/html/web/themes/custom/base_starterkit
