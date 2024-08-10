ARG PHP_IMAGE

FROM $PHP_IMAGE 

USER root

RUN apk add --update supervisor && rm  -rf /tmp/* /var/cache/apk/*

COPY docker/supervisor/supervisord.conf /etc/

CMD ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]

ENTRYPOINT []
