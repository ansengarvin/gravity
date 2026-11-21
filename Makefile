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

# Every browser inside the same image CI uses, to reproduce a CI failure exactly. node_modules gets a volume of its own,
# so the container's Linux packages don't overwrite the ones installed here.
.PHONY: playwright-docker
playwright-docker:
	cd $(SRC_ROOT) && version=$$(node -p "require('@playwright/test/package.json').version") && \
		MSYS_NO_PATHCONV=1 docker run --rm --ipc=host -e CI=1 -v "$(SRC_ROOT)":/work -v /work/node_modules -w /work \
		mcr.microsoft.com/playwright:v$$version-noble sh -c "npm ci && npm run build && xvfb-run -a npx playwright test"
