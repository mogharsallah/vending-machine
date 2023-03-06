test-database-docker-compose-file=__tests__/__lib__/api/docker-compose.yml
jest-api-config-file=./jest.api.config.ts
test-database-port=3308
test-database-host=localhost

start-test-database:
	@echo "Starting the test databse..."
	docker compose -f $(test-database-docker-compose-file) up -d --wait
	@echo "Test database started"

stop-test-database:
	@echo "Stopping the test databse..."
	docker compose -f $(test-database-docker-compose-file) stop
	docker compose -f $(test-database-docker-compose-file) rm -f
	@echo "Test database stopped"

test-api:
	make start-test-database
# If tests fail the database server will be stopped
	npx jest --config $(jest-api-config-file) --runInBand || make stop-test-database
	make stop-test-database
watch-test-api:
	make start-test-database
	npx jest --config $(jest-api-config-file) --runInBand --watch
