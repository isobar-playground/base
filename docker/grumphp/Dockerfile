ARG PHP_TAG

FROM wodby/drupal-php:${PHP_TAG:-latest}

COPY --chown=wodby . /home/wodby/app

WORKDIR /home/wodby/app

RUN cd html && composer install
