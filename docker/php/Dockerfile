ARG PHP_TAG

FROM wodby/drupal-php:$PHP_TAG

COPY --chown=wodby html /var/www/html

RUN composer install
