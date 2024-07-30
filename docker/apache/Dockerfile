ARG APACHE_TAG
ARG PHP_IMAGE

FROM $PHP_IMAGE as php

FROM wodby/apache:$APACHE_TAG

COPY --from=php /var/www/html /var/www/html
