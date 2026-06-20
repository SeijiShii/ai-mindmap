#!/usr/bin/env bash
# Production deploy (Vercel CLI, no git integration — GitHub=SeijiShii / Vercel=quadii
# are intentionally unlinked, user-microservice-account memory). All api/* are edge
# functions → Vercel bundles extensionless ESM imports automatically (no O51 trap),
# so a plain `vercel deploy --prod` works; no Build Output API scaffold needed.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▸ syncing production env → Vercel"
bash scripts/sync-prod-env.sh

echo "▸ deploying to production"
vercel deploy --prod --yes
