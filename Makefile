include .env
include .env.local

default: up

COMPOSER_ROOT ?= /var/www/html
DRUPAL_ROOT ?= /var/www/html/web
COMPOSE ?= docker compose --env-file .env --env-file .env.local
GIT_SHA := $(shell git rev-parse HEAD)

## help	:	Print commands help.
.PHONY: help
ifneq (,$(wildcard docker.mk))
help : docker.mk
	@sed -n 's/^##//p' $<
else
help : Makefile
	@sed -n 's/^##//p' $<
endif

## up	:	Start up containers.
.PHONY: up
up:
	touch .env.local
	@echo "Starting up containers for $(PROJECT_NAME) at $(PROJECT_BASE_URL)..."
	@$(COMPOSE) pull
	@$(COMPOSE) up -d --build --remove-orphans
	@$(COMPOSE) run --rm grumphp sh -c 'cd html && composer install'
	@echo -n "MySQL is initializing";
	@until docker compose exec mariadb mariadb -s -u $(DB_USER) -p$(DB_PASSWORD) $(DB_NAME) -e "SELECT COUNT(*) FROM users" > /dev/null 2>&1; do \
		echo -n "."; \
		sleep 10; \
	done
	@echo ""
	@echo "MySQL is ready to accept connections."

## down	:	Stop containers.
.PHONY: down
down: stop

## start	:	Start containers without updating.
.PHONY: start
start:
	@echo "Starting containers for $(PROJECT_NAME) from where you left off..."
	@$(COMPOSE) start

## stop	:	Stop containers.
.PHONY: stop
stop:
	@echo "Stopping containers for $(PROJECT_NAME)..."
	@$(COMPOSE) stop

## prune	:	Remove containers and their volumes.
##		You can optionally pass an argument with the service name to prune single container
##		prune mariadb	: Prune `mariadb` container and remove its volumes.
##		prune mariadb solr	: Prune `mariadb` and `solr` containers and remove their volumes.
.PHONY: prune
prune:
	@echo "Removing containers for $(PROJECT_NAME)..."
	@$(COMPOSE) rm -svf $(filter-out $@,$(MAKECMDGOALS))

## ps	:	List running containers.
.PHONY: ps
ps:
	@docker ps --filter name='$(PROJECT_NAME)*'

## shell	:	Access `php` container via shell.
##		You can optionally pass an argument with a service name to open a shell on the specified container
.PHONY: shell
shell:
	@docker exec -ti -e COLUMNS=$(shell tput cols) -e LINES=$(shell tput lines) $(shell docker ps --filter name='$(PROJECT_NAME)_$(or $(filter-out $@,$(MAKECMDGOALS)), 'php')' --format "{{ .ID }}") sh

## composer	:	Executes `composer` command in a specified `COMPOSER_ROOT` directory (default is `/var/www/html`).
##		To use "--flag" arguments include them in quotation marks.
##		For example: make composer "update drupal/core --with-dependencies"
.PHONY: composer
composer:
	@docker exec $(shell docker ps --filter name='^/$(PROJECT_NAME)_php' --format "{{ .ID }}") composer --working-dir=$(COMPOSER_ROOT) $(filter-out $@,$(MAKECMDGOALS))

## drush	:	Executes `drush` command in a specified `DRUPAL_ROOT` directory (default is `/var/www/html/web`).
##		To use "--flag" arguments include them in quotation marks.
##		For example: make drush "watchdog:show --type=cron"
.PHONY: drush
drush:
	@docker exec $(shell docker ps --filter name='^/$(PROJECT_NAME)_php' --format "{{ .ID }}") drush -r $(DRUPAL_ROOT) $(filter-out $@,$(MAKECMDGOALS))

## logs	:	View containers logs.
##		You can optinally pass an argument with the service name to limit logs
##		logs php	: View `php` container logs.
##		logs nginx php	: View `nginx` and `php` containers logs.
.PHONY: logs
logs:
	@$(COMPOSE) logs -f $(filter-out $@,$(MAKECMDGOALS))

## build	:	Build containers for production.
.PHONY: build
build:
	@docker image rm -f $(PROJECT_NAME)_node:$(GIT_SHA) > /dev/null 2>&1
	@docker image rm -f $(PROJECT_NAME)_php:$(GIT_SHA) > /dev/null 2>&1
	@docker image rm -f $(PROJECT_NAME)_apache:$(GIT_SHA) > /dev/null 2>&1

	@docker build --progress=plain --no-cache --build-arg NODE_TAG=$(NODE_TAG) -f docker/node/Dockerfile . -t $(PROJECT_NAME)_node:$(GIT_SHA)
	@docker build --progress=plain --no-cache --build-arg PHP_TAG=$(PHP_TAG) --build-arg NODE_IMAGE=$(PROJECT_NAME)_node:$(GIT_SHA) -f docker/php/Dockerfile . -t $(PROJECT_NAME)_php:$(GIT_SHA)
	@docker build --progress=plain --no-cache --build-arg APACHE_TAG=$(APACHE_TAG) --build-arg PHP_IMAGE=$(PROJECT_NAME)_php:$(GIT_SHA) -f docker/apache/Dockerfile . -t $(PROJECT_NAME)_apache:$(GIT_SHA)

# https://stackoverflow.com/a/6273809/1826109
%:
	@:
