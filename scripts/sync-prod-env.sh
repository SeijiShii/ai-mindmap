#!/usr/bin/env bash
# Sync .env.production.local → Vercel production env (idempotent, masked output).
# Reads each non-empty var, removes the existing one, re-adds via stdin so the raw
# value never appears in argv/shell history. Output masks values to the last 4
# chars. (release §3.1c) The agent runs this without reading the secret values.
set -euo pipefail
cd "$(dirname "$0")/.."

ENV_FILE=".env.production.local"
[ -f "$ENV_FILE" ] || { echo "✗ $ENV_FILE not found"; exit 1; }

while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in ''|\#*) continue ;; esac
  key="${line%%=*}"
  val="${line#*=}"
  # strip a trailing " # inline comment" (space-prefixed # only) and surrounding ws
  val="$(printf '%s' "$val" | sed -E 's/[[:space:]]+#.*$//' | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"
  case "$key" in [A-Z]*) ;; *) continue ;; esac
  if [ -z "$val" ]; then
    vercel env rm "$key" production -y >/dev/null 2>&1 || true
    echo "  - $key (empty → removed)"
    continue
  fi
  vercel env rm "$key" production -y >/dev/null 2>&1 || true
  printf '%s' "$val" | vercel env add "$key" production >/dev/null 2>&1
  echo "  ✓ $key = …${val: -4}"
done < "$ENV_FILE"
echo "env sync done."
