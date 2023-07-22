.PHONY: build-dev
build-dev: ## Build the dev docker image.
	docker compose -f docker/development/docker-compose.yml build

.PHONY: start-dev
start-dev: ## Start the dev docker container.
	docker compose -f docker/development/docker-compose.yml up -d

.PHONY: stop-dev
stop-dev: ## Stop the dev docker container.
	docker compose -f docker/development/docker-compose.yml down

.PHONY: build-production
build-production: ## Build the production docker image.
	docker compose -f docker/production/docker-compose.yml build

.PHONY: start-production
start-production: ## Start the production docker container.
	docker compose -f docker/production/docker-compose.yml up -d

.PHONY: stop-production
stop-production: ## Stop the production docker container.
	docker compose -f docker/production/docker-compose.yml down
