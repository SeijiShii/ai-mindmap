# 実装レポート — Stripe 実連携 + Webhook (O64)

> **状態**: 完了（no-key スコープ） / **日付**: 2026-06-20

## 実装サマリ
billing を mock-only から実 Stripe 連携へ。checkout session 作成 + webhook 署名検証 (O64 3 状態) + 冪等トップアップ + DB 反映を、注入式 (O35) ハンドラ + 実 Stripe バインディングで実装。

## 変更/新規ファイル
| ファイル | 内容 |
|---|---|
| src/app/api-billing.ts (新) | makeCheckoutHandler (401/200/clamp) + makeWebhookHandler (400不正署名 / 200無関係ack / 200冪等トップアップ) + WebhookSignatureError |
| src/features/billing/stripe-client.ts (新) | createStripeCheckout (JPY100×packs, origin 由来 URL) + verifyStripeWebhook (constructEvent) |
| src/features/billing/checkout-client.ts (新) | startCheckout (fetch + redirect) |
| api/billing/checkout.ts, api/billing/webhook.ts (新) | Vercel Functions (nodejs runtime) |
| src/db/schema.ts | processed_events テーブル |
| src/app/server-deps.ts | processedEventStore (DB) + grantTopup (sql 加算) |
| drizzle.config.ts (新) + drizzle/0000_*.sql (新) | マイグレーション基盤 + 初期 SQL |
| package.json | stripe@^18.5.0 |
| src/app/api-billing.test.ts (新, 7) + checkout-client.test.ts (新, 2) + schema.test.ts | テスト |

## テスト結果
- 全 130 tests green（billing +9）、typecheck clean、vite build 成功
- O64 3 状態 (W1 400 / W2 200 ack / W3 200 grant) + 冪等 (W4 1 回のみ) 検証
- deps: stripe 追加後も Critical/High 0（残 4 moderate は dev-only esbuild、pre-existing）

## 残（release / Class B）
- `npm run db:migrate` で processed_events 適用（DATABASE_URL）
- STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET FILL → test キーで Checkout 疎通 → live 化 (B-4 実課金 1 回確認)
- Stripe Dashboard で webhook endpoint (`/api/billing/webhook`) 登録 + 署名シークレット取得
- UpgradePanel を quota 402 フローに mount（フロント導線、別途）
