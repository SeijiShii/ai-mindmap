# 実装レポート: _shared/db

## 実装日時
2026-06-19 (JST)

## モード
feature (cross-cutting)

## 関連ドキュメント
- 001__shared_db_SPEC.md / 002__shared_db_PLAN.md / 003__shared_db_UNIT_TEST.md
- [AI_LOG](../AI_LOG/D20260619_021_tdd__shared_db.md)

## 変更一覧

### Phase 1: スキーマ + クライアント
- `src/db/schema.ts` — Drizzle pgTable × 5 (users/maps/nodes/edges/usageLog) + pgEnum × 4 (node_source/node_status/edge_kind/ai_endpoint) + インデックス (maps.owner / nodes.map / edges.map / usage_log(owner,created)) + cascade FK
- `src/db/client.ts` — `createDb(connectionString)`：Neon serverless HTTP + Drizzle。接続文字列を注入（env 非依存・テスト可能）
- `package.json` / `tsconfig.json` / `vitest.config.ts` — プロジェクト scaffold（Vite/TS/Vitest/Drizzle/Zod）

### Phase 2: withOwner 所有者スコープ土台（SEC-001）
- `src/db/with-owner.ts` — `ensureOwnerId` / `ownerScope` / `assertOwner` / `OwnerScopeError(status=404)`。全 owner-scoped クエリに `owner_id = ctxOwner` を強制、他人行は 404 で弾く（漏洩防止）
- `src/db/index.ts` — re-export

## 実装計画からの差分
| 項目 | 内容 |
|---|---|
| 計画にない追加 | プロジェクト scaffold（package.json 等）を本モジュールで先行作成（greenfield の最初の実装対象のため） |
| 計画から省略 | maps-repo の実 CRUD は map-management 側に委譲（db は土台 + 強制プリミティブまで） |
| 想定外の問題 | なし（pg-mem 結合テストは Phase 後半 / map-management 結合で実施予定、本 Phase は純ロジック + 型で検証） |

## PR Description
### タイトル
_shared/db: Neon+Drizzle スキーマ + 所有者強制土台 (SEC-001)
### 概要
マインドマップの永続化基盤。5 テーブル + 列挙 + 所有者スコープ強制プリミティブ。
### 変更内容
- Drizzle スキーマ（users/maps/nodes/edges/usage_log）
- createDb クライアント（接続注入）
- withOwner 所有者強制（SEC-001、RLS でなくアプリ層）
### テスト
- 15/15 パス（with-owner 9 + schema 6）、typecheck clean
