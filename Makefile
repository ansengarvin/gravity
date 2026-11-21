SRC_ROOT := $(shell git rev-parse --show-toplevel)

.PHONY: dev
dev:
	cd $(SRC_ROOT) && npm run dev

.PHONY: build
build:
	cd $(SRC_ROOT) && npm run build

.PHONY: lint
lint:
	cd $(SRC_ROOT) && npm run lint && npx prettier . --check

.PHONY: test
test: lint playwright

# Smoke tests against the built site. Locally Firefox only; with CI=1, every browser like CI.
.PHONY: playwright
playwright: build
	cd $(SRC_ROOT) && npx playwright test
