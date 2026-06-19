# _shared/db 実装計画書

> **入力**: `./001__shared_db_SPEC.md`, `../../concept.md` §1.4 / §4.3
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル一覧

| ファイル | 責務 | 依存 | LOC 見積 |
|---|---|---|---|
| `src/db/schema.ts` | Drizzle テーブル定義（users/maps/nodes/edges/usageLog + pgEnum + relations） | drizzle-orm | 140 |
| `src/db/client.ts` | Neon serverless driver + Drizzle クライアント（DATABASE_URL） | @neondatabase/serverless, drizzle-orm | 30 |
| `src/db/with-owner.ts` | 所有者スコープ強制ヘルパの土台（SEC-001、ctxOwner 受領） | schema | 60 |
| `drizzle.config.ts` | drizzle-kit 設定（migrations 出力先） | — | 20 |
| `drizzle/0000_init.sql` | 初期マイグレーション（drizzle-kit generate） | schema | 自動生成 |
| `src/db/index.ts` | re-export（db, schema, withOwner） | — | 10 |

> 言語・FW: TypeScript + Drizzle + @neondatabase/serverless（concept §4.3 確定）。

## 2. 実装 Phase 分割

### Phase 1 (RED→GREEN→IMPROVE): スキーマ + クライアント
- 対象: `schema.ts`, `client.ts`, `drizzle.config.ts`
- テスト: スキーマ型の整合（enum 値 / FK / not null）、テストは pg-mem or テスト用 Neon ブランチで CRUD
- ゴール: マイグレーション生成成功 + 全テーブル作成

### Phase 2: withOwner 所有者スコープ土台
- 対象: `with-owner.ts`
- テスト: owner_id 一致なら通る / 不一致なら弾く / owner なしクエリを禁止
- ゴール: SEC-001 の所有者強制が単体で検証可能

## 3. 依存関係順序
```
schema.ts → client.ts → with-owner.ts → index.ts
（drizzle.config + migration は schema 完成後）
```

## 4. 既存ファイルへの影響
なし（greenfield、最初の実装対象）

## 5. 横断フォルダへの追加・変更
本フォルダ自体（_shared/db）。他横断（auth/cost-tracking）が本スキーマを参照する。

## 6. リスク・注意点
- Neon serverless driver はエッジ/Node 両対応だが、Vercel Functions のランタイム設定に注意
- pg-mem はテスト高速だが Neon 固有挙動を完全再現しない → 重要クエリはテスト用 Neon dev ブランチで結合（Phase 後半）
- RLS でなくアプリ層強制のため、`withOwner` を経由しない生クエリを書かない規律が重要（lint ルール検討）

## 7. 完了の定義（DoD）
- [ ] Phase 1-2 完了
- [ ] マイグレーション生成 + テスト DB へ適用成功
- [ ] withOwner の所有者強制が単体テストで green
- [ ] カバレッジ目標達成（003 参照）
- [ ] E2E は cross-cutting のためスキップ（統合は map-management / mindmap-canvas の E2E でカバー）

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
