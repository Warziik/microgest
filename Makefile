PHP_CONTAINER = docker exec -ti php8-container
NODE_CONTAINER = docker-compose run --rm node-service

.DEFAULT_GOAL = help

#COLORS
GREEN  = \033[0;32m
WHITE  = \033[m
YELLOW = \033[0;33m
RESET  = \033[m

HELP_FUN = \
	%help; \
    while(<>) { push @{$$help{$$2 // 'options'}}, [$$1, $$3] if /^([a-zA-Z\-]+)\s*:.*\#\#(?:@([a-zA-Z\-]+))?\s(.*)$$/ }; \
	print "usage: make [target]\n\n"; \
	for (sort keys %help) { \
	print "${WHITE}$$_:${RESET}\n"; \
	for (@{$$help{$$_}}) { \
	$$sep = " " x (32 - length $$_->[0]); \
	print "  ${YELLOW}$$_->[0]${RESET}$$sep${GREEN}$$_->[1]${RESET}\n"; \
	}; \
	print "\n"; }

help: ##@default Show this help.
	@perl -e '$(HELP_FUN)' $(MAKEFILE_LIST)

## ----------------------------------------------------------------
## DOCKER
## ----------------------------------------------------------------
.PHONY: build-docker
build-docker: ##@docker Build the Docker-compose stack
	docker-compose up -d --build


## ----------------------------------------------------------------
## PROJECT
## ----------------------------------------------------------------
.PHONY: install
install: build-docker ##@project Install the PHP and JavaScript dependencies.
	$(PHP_CONTAINER) composer install -n
	$(NODE_CONTAINER) yarn install
	$(PHP_CONTAINER) touch .env.local && echo JWT_PASSPHRASE=test > .env.local

.PHONY: assets
assets: ##@project Build the JavaScript assets.
	$(NODE_CONTAINER) yarn dev

.PHONY: jwt-keys
jwt-keys: ##@project Generate the JWT keys.
	$(PHP_CONTAINER) openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096 -pass pass:test
	$(PHP_CONTAINER) openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout -passin pass:test

.PHONY: cache-clear
cache-clear: ##@project Clear the cache.
	$(PHP_CONTAINER) symfony console c:c


## ----------------------------------------------------------------
## DATABASE
## ----------------------------------------------------------------
.PHONY: db
db: ##@database Create the database and run the migrations.
	$(PHP_CONTAINER) symfony console d:d:c --if-not-exists
	$(PHP_CONTAINER) symfony console d:m:m --no-interaction

.PHONY: fixtures
fixtures: ##@database Load the data fixtures.
	$(PHP_CONTAINER) symfony console d:f:l -n


## ----------------------------------------------------------------
## TESTS AND CODE QUALITY
## ----------------------------------------------------------------
.PHONY: test
test: ##@tests Execute all the tests.
	$(PHP_CONTAINER) php bin/phpunit
	$(NODE_CONTAINER) yarn test

.PHONY: test-php
test-php: ##@tests Execute the PHP tests.
	$(PHP_CONTAINER) php bin/phpunit

.PHONY: test-js
test-js: ##@tests Execute the JavaScript tests.
	$(NODE_CONTAINER) yarn test

phpcs: ##@code-quality Check the PHP code quality (PHPCodeSniffer)
	${PHP_CONTAINER} vendor/bin/phpcs

phpcbf: ##@code-quality Fix small issues in PHP code quality
	${PHP_CONTAINER} vendor/bin/phpcbf

.PHONY: lint
lint: ##@code-quality Check the JavaScript code quality (ESint).
	$(NODE_CONTAINER) yarn lint