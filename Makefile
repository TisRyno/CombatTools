FIG=docker-compose
RUN_APP=$(FIG) run --rm app
EXEC_APP=$(FIG) exec app
EXEC_REDIS=$(FIG) exec redis
CONSOLE=app/console

.DEFAULT_GOAL := help
.PHONY: help start stop restart logs stats clear provision run command run-node build up watch-logs

help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

ifeq (run,$(firstword $(MAKECMDGOALS)))
  # use the rest as arguments for "run"
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  # ...and turn them into do-nothing targets
  $(eval $(RUN_ARGS):;@:)
endif

##
##-------------------------------------------------------------------------------------
##               Firebox.com docker infrastructure help
##-------------------------------------------------------------------------------------
##
##
## Project setup
##-------------------------------------------------------------------------------------

start:                ## Install and start the project
start: build up watch-logs

stop:                 ## Remove docker containers
	$(FIG) kill
	$(FIG) rm -v --force

restart:              ## Restart the whole project
restart: stop start

provision:            ## First setup command.
                      ## Run this command to bring your containers
                      ## to a clean working state.
provision: stop clean check-config build up composer-install media-assets elasticsearch-update watch-logs

logs:                 ## Watch logs from containers (Ctrl+C anytime to stop)
	$(FIG) logs --tail 300 -f $(filter-out logs,$(MAKECMDGOALS))

clear:                ## Remove all the symfony cache and flush redis
	$(EXEC_APP) rm -rf /tmp/symfony
	$(EXEC_REDIS) redis-cli flushall

clean:                ## Remove add from MySQL and Redis
                      ## use only when cointainers are down
	rm -rf ./docker/mysql/data
	rm -rf ./docker/redis/data

#  brew cask install ngrok

##
## Run
##-------------------------------------------------------------------------------------

run:                  ## Run an arbitrary command inside the app main container.
                      ## To use it, run: `make run -- <YourCommand>`
                      ## e.g. `make run -- php firebox/script/abc.php`
	$(FIG) run --rm app $(filter-out $@,$(MAKECMDGOALS))

command:              ## Run a symfony command inside the app main container.
                      ## To use it, run: `make command -- symfony:symfony`
	$(EXEC_APP) php symfony/$(CONSOLE) $(filter-out $@,$(MAKECMDGOALS))

run-node:             ## Like above, inside the node container.
                      ## To use it, run: `make run-node -- <YourCommand>`
                      ## e.g. `make run-node -- npm rebuild`
	$(FIG) run --no-deps --rm webpack $(filter-out $@,$(MAKECMDGOALS))

# This is a very very big cheat. pt2
%:
	@:

##
## Helpers
##-------------------------------------------------------------------------------------
composer-install:     ## Only really used for setup of project,
                      ## runs the composer install command
	$(RUN_APP) bash -c "cd symfony && /usr/local/bin/composer install"

composer-update:      ## Updates all vendor packages using
                      ## the composer update command
	$(RUN_APP) bash -c "cd symfony && /usr/local/bin/composer update"

##
## Nodejs server
##-------------------------------------------------------------------------------------
build-server:         ## Build node server (for pre-render)
	@echo "Building ..." && $(FIG) run --no-deps --rm webpack yarn build-server && echo "Build completed";

##
## Webpack
##-------------------------------------------------------------------------------------
restart-webpack:      ## Restart the webpack instance
	$(FIG) stop webpack
	$(FIG) up --build -d webpack
	$(FIG) logs --tail 300 webpack

build-assets:         ## Build webpack assets (no hot reload)
	$(FIG) run --no-deps --rm webpack yarn run build

##
## Consumers
##-------------------------------------------------------------------------------------
react-render:         ## Builds the node server JS then
                      ## runs both the node server and
                      ## php consumer for react render
react-render: build-server
	docker kill node-server node-consumer > /dev/null 2>&1 || true
	docker rm -v force node-server node-consumer > /dev/null 2>&1 || true
	$(FIG) run --rm --name=node-server -d webpack node ./build/server/server.js -p 8080 && echo "Node server running in background ...";
	$(FIG) run --rm --name=node-consumer app php symfony/$(CONSOLE) consumer:react-render http://node-server:8080 -m 100 -v

react-render-run:     ## Only runs the node server and
                      ## and consumer
	docker kill node-server > /dev/null 2>&1 || true
	docker kill node-consumer > /dev/null 2>&1 || true
	docker rm -v force node-server node-consumer > /dev/null 2>&1 || true
	$(FIG) run --rm --name=node-server -d webpack node ./build/server/server.js -p 8080 && echo "Node server running in background ...";
	$(FIG) run --rm --name=node-consumer app php symfony/$(CONSOLE) consumer:react-render http://node-server:8080 -m 100 -v

##
## Docker wise
##-------------------------------------------------------------------------------------
docker-clean:         ## Removes all the stopped & untagged containers
                      ## Should be run every once in a while...
	@docker rm $(docker ps -a -q) 2>/dev/null || true
	@docker rmi $(docker images | grep "^<none>" | awk "{print $3}") 2>/dev/null || true
	@echo "Done!"

stats:                ## Get stats about all running containers
	docker stats --no-stream --format "table {{.Container}}\t{{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

##
##

# Internal rules

build:
	$(FIG) build

up:
	$(FIG) up -d

warmup:
	$(EXEC_APP) bash -c "php symfony/app/console cache:clear --env=prod --no-debug && php symfony/app/console cache:warmup --env=prod --no-debug && chmod -R 777 /tmp/symfony"

watch-logs:
	$(FIG) logs --tail 300 -f

check-config:
	grep '^127\.0\.0\.1\s*.*www\.dungeon-tools\.com' /etc/hosts || echo '127.0.0.1	dungeon-tools.com www.dungeon-tools.com' | sudo tee -a /etc/hosts

attach:
	docker exec -it `docker ps | grep combattools_$(filter-out $@,$(MAKECMDGOALS)) | cut -d ' ' -f 1` /bin/sh

expose-shipwire:
	@ngrok start -config=./ngrok.conf `whoami`-shipwire;

expose-travis:
	@ngrok start -config=./ngrok.conf `whoami`-travis;
