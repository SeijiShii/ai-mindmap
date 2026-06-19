#!/usr/bin/env bash
# Integrated local dev launcher (perspectives O36).
# Frontend (Vite) + API (Vercel Functions) against a Neon dev branch.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env.local ]; then
  echo "⚠ .env.local がありません。.env.example をコピーして実値を入れてください (docs/PREREQUISITES.md)。"
fi

echo "▶ 型チェック + ユニットテスト (smoke)"
npm run typecheck
npm run test

echo "▶ dev サーバー起動。API は 'vercel dev' を併用してください。"
exec npm run dev
