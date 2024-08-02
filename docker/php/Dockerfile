ARG PHP_TAG
ARG NODE_IMAGE

FROM $NODE_IMAGE as node

FROM wodby/drupal-php:$PHP_TAG

COPY --chown=wodby html /var/www/html

RUN composer install

COPY --chown=wodby --from=node /var/www/html/web/themes/custom/base /var/www/html/web/themes/custom/base
