#!/bin/bash
# SessionStart hook for Claude Code on the web.
# Installs dependencies and generates the typed API client so a fresh web
# session can immediately run `npm run typecheck` / `npm run build`.
set -euo pipefail

# Only do work in remote (Claude Code on the web) sessions.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

log="$(mktemp)"

# `npm install` (not `npm ci`) so the cached container layer is reused on later
# sessions. Verbose output is kept out of the session context unless it fails.
echo "[session-start] installing dependencies…"
if ! npm install >"$log" 2>&1; then
  echo "[session-start] npm install failed:"
  cat "$log"
  exit 1
fi

# Generate the typed API client from the committed OpenAPI snapshot.
if [ -f openapi.json ]; then
  echo "[session-start] generating API types from openapi.json…"
  if ! npm run gen:api >"$log" 2>&1; then
    echo "[session-start] gen:api failed:"
    cat "$log"
    exit 1
  fi
fi

echo "[session-start] ready → npm run typecheck | npm run build | npm run dev"
