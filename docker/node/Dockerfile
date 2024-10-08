ARG NODE_TAG

FROM wodby/node:$NODE_TAG

COPY --chown=node html /var/www/html

WORKDIR /var/www/html/web/themes/custom/base_starterkit

RUN npm ci \
    && npm run build \
    && rm -rf node_modules
