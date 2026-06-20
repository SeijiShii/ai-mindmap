#!/usr/bin/env bash
# Production deploy (Vercel CLI, no git integration — GitHub=SeijiShii / Vercel=quadii
# are intentionally unlinked, user-microservice-account memory). All api/* are edge
# functions → Vercel bundles extensionless ESM imports automatically (no O51 trap),
# so a plain `vercel deploy --prod` works; no Build Output API scaffold needed.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▸ syncing production env → Vercel"
bash scripts/sync-prod-env.sh

echo "▸ building (Build Output API, esbuild-bundled functions → no O51 ERR_MODULE_NOT_FOUND)"
rm -rf .vercel/output
node scripts/vercel-build.mjs

# Guard: no unbundled raw api/*.js left, function count within Hobby limit (12).
nfunc=$(find .vercel/output/functions -name '*.func' -type d | wc -l)
echo "  functions: $nfunc"
[ "$nfunc" -le "${MAX_FUNCTIONS:-12}" ] || { echo "✗ too many functions ($nfunc > ${MAX_FUNCTIONS:-12})"; exit 1; }

echo "▸ deploying prebuilt output to production"
vercel deploy --prebuilt --prod --yes
