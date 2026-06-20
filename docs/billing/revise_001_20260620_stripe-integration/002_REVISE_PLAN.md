# billing 変更計画書（Stripe 実連携）

> **入力**: 001_REVISE_SPEC, billing SPEC §2, _shared/db schema
> **最終更新**: 2026-06-20

## 1. 既存ファイル変更一覧
| ファイル | 変更 | リスク |
|---|---|---|
| src/db/schema.ts | processed_events テーブル + schema export 追加 | 低 |
| src/app/server-deps.ts | processedEventStore (DB) + grantTopup(sql 加算) 追加 | 低 |
| src/db/schema.test.ts | テーブル数アサーション更新 | 低 |
| package.json | `stripe@^18` 追加 | 低（dev-only moderate vuln, Critical/High 0 維持） |

## 2. 新規ファイル一覧
| ファイル | 責務 | LOC |
|---|---|---|
| src/app/api-billing.ts | makeCheckoutHandler / makeWebhookHandler (O64 3 状態, 注入式) | ~100 |
| src/features/billing/stripe-client.ts | createStripeCheckout / verifyStripeWebhook (実 Stripe) | ~55 |
| src/features/billing/checkout-client.ts | startCheckout (フロント fetch+redirect) | ~20 |
| api/billing/checkout.ts, api/billing/webhook.ts | Vercel Functions 配線 (nodejs runtime) | ~20 |
| src/app/api-billing.test.ts | checkout 401/200/clamp + webhook 3 状態 + 冪等 = 7 tests | ~120 |
| src/features/billing/checkout-client.test.ts | redirect / エラー = 2 tests | ~30 |
| drizzle.config.ts + drizzle/0000_*.sql | マイグレーション基盤 + 初期 SQL | — |

## 3. 削除ファイル一覧
(なし)

## 4. マイグレーション要否
- DB スキーマ変更: ✅ (processed_events) → 005_REVISE_MIGRATION.md

## 5. 実装 Phase 分割
### Phase 1: schema + server-deps store/grant + migration
### Phase 2: 注入式ハンドラ (checkout/webhook) + tests
### Phase 3: 実 Stripe バインディング + api/ 配線 + フロント client

## 7. ロールアウト計画
| ステップ | 内容 | 検証 |
|---|---|---|
| 1 | no-key 出荷（コード/ルート/署名検証/冪等） | 130 tests green + build |
| 2 | release: STRIPE keys FILL → db:migrate apply (Class B) → test→live → 実課金 1 回確認 (B-4) | 実機 |

## 9. DoD
- [x] checkout/webhook 実装 + 9 tests green / [x] migration 生成 / [x] typecheck+build / [ ] 実 Stripe 疎通（release）

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:revise |
