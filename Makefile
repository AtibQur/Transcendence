all:
	@docker compose up -d --build

down:
	@docker compose down -v

re: down all
