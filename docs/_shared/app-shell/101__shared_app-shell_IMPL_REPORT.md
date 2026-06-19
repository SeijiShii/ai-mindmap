# 実装レポート: _shared/app-shell

## 実装日時
2026-06-19 (JST)

## モード
feature (cross-cutting, 合成 O57)

## 変更一覧
### Phase 1-2: 合成ルート + ルーティング + providers
- `index.html` / `src/main.tsx`（ClerkProvider）/ `src/app/App.tsx`（QueryClientProvider + MemoryRouter + AppShell + 入口リード/InfoButton(O41) + フッタ legal 導線(O55)）
- `vite.config.ts` / `src/vite-env.d.ts`
### Phase 3: API ルートハンドラ合成（差別化パス）
- `src/app/api-structure.ts` — /api/structure 合成: requireOwner(401)→Zod(400)→quota(402)→owner-scoped load→ai-client→add-only merge→save→usage（O57 + P4.46 + SEC-002/004 統合）
### Phase 3.5: bootstrap (O36/O37/O56)
- `scripts/dev.sh` / `scripts/stop.sh`（O36）/ `.github/workflows/ci.yml` + `dependabot.yml`（O37）/ `.env.example` / `public/favicon.svg` + `manifest.webmanifest`（O56）

## 実装計画からの差分
| 項目 | 内容 |
|---|---|
| 合成 + build | **`vite build` 成功**（dist 生成）。app-shell smoke + structure API 統合テスト green |
| 残 | リッチな feature 画面（フル reactflow キャンバス編集 / CapturePanel 等）は route placeholder。expand/maps/billing/feedback/legal の API ハンドラは structure と同型で app-shell に追加配線が残る。視覚レビュー(Design gate b)・wording・E2E・release は後続 |

## PR Description
### タイトル
_shared/app-shell: アプリ合成 + デプロイ scaffold（O57/O36/O37）
### テスト
- app-shell smoke 5 + structure API 統合 5 = green、`vite build` 成功、typecheck clean（全体 95/95）
