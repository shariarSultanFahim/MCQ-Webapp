# Docker Compose Command (adjust if you use 'docker compose' instead of 'docker-compose')
DC := docker-compose

# Service Name from docker-compose.yml
APP_SERVICE := app

.PHONY: help up down stop start restart logs build shell migrate init

help: ## Show this help message
	@echo "Usage: make [command]"
	@echo ""
	@echo "Commands:"
	@echo "init : First-time setup: Build, Start, and Migrate"
	@echo "up : Start the containder in detached mode"
	@echo "down : Stop and remove containers, networks, and images"
	@echo "stop : Stop containers without removing them"
	@echo "start : Start existing containers"
	@echo "restart : Restart containers"
	@echo "logs : View output logs"
	@echo "build : Rebuild the containers"
	@echo "clean : Down and remove volumes (WARNING: Deletes database data)"
	@echo "shell : Open a shell inside the running app container"
	@echo "migrate : Run Prisma migrations inside the container"
	

up: ## Start containers in detached mode
	$(DC) up -d

down: ## Stop and remove containers, networks, and images
	$(DC) down

stop: ## Stop containers without removing them
	$(DC) stop

start: ## Start existing containers
	$(DC) start

restart: ## Restart containers
	$(DC) restart

logs: ## View output logs
	$(DC) logs -f

build: ## Rebuild the containers
	$(DC) build

clean: ## Down and remove volumes (WARNING: Deletes database data)
	$(DC) down -v

shell: ## Open a shell inside the running app container
	$(DC) exec $(APP_SERVICE) sh

migrate: ## Run Prisma migrations inside the container
	$(DC) exec $(APP_SERVICE) npx prisma migrate deploy

init: build up ## First-time setup: Build, Start, and Migrate
	@echo "Waiting for database to be ready..."
	@sleep 5
	$(DC) exec $(APP_SERVICE) npx prisma migrate deploy
	@echo "Application initialized and migrations applied!"