#!/usr/bin/env bash
# SessionStart hook for Claude Code on the web.
# Makes a fresh session immediately able to run `npm run typecheck` / `build`.
set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

# 1. Install dependencies. Containers start empty on the web, so this normally
#    runs a clean install; on a resumed session node_modules already exists.
if [ ! -d node_modules ]; then
  echo "[session-start] installing dependencies…"
  npm ci || npm install
else
  echo "[session-start] node_modules present — skipping install"
fi

# 2. Generate the typed API client from the committed OpenAPI snapshot so that
#    typecheck/build work without any manual step.
if [ -f openapi.json ]; then
  echo "[session-start] generating API types from openapi.json…"
  npm run gen:api
fi

echo "[session-start] ready → npm run dev | npm run typecheck | npm run build"
