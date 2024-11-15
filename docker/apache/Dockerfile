ARG APACHE_TAG
ARG PHP_IMAGE

FROM ${PHP_IMAGE:-wodby/php} AS php

FROM wodby/apache:${APACHE_TAG:-latest}

COPY --from=php /var/www/html /var/www/html
