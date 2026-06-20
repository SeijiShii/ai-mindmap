#!/usr/bin/env bash
# Run a CLI command with env loaded from an env file (default .env.production.local).
# dotenv-style parse via `export key=val` (NOT `source`, which would mangle `&` in
# DATABASE_URL query strings). Used for drizzle-kit migrate etc. (release §3.1c).
#   ENV_FILE=.env.production.local bash scripts/with-env.sh npx drizzle-kit migrate
set -euo pipefail
cd "$(dirname "$0")/.."
ENV_FILE="${ENV_FILE:-.env.production.local}"
[ -f "$ENV_FILE" ] || { echo "✗ $ENV_FILE not found"; exit 1; }
while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in ''|\#*) continue ;; esac
  key="${line%%=*}"
  case "$key" in [A-Z]*) ;; *) continue ;; esac
  val="${line#*=}"
  val="$(printf '%s' "$val" | sed -E 's/[[:space:]]+#.*$//' | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"
  [ -z "$val" ] && continue
  export "$key=$val"
done < "$ENV_FILE"
exec "$@"
