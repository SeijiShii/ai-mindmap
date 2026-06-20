# billing 変更仕様書（Stripe 実連携 + Webhook ルート）

> **改修種別**: 拡張（mock → 実連携）
> **issue / slug**: 001 / stripe-integration
> **基準 SPEC**: `../001_billing_SPEC.md`
> **最終更新**: 2026-06-20
> **タグ**: feature, auth-required
> **起点**: AUDIT_20260620_1232.md [AUDIT-perspective-002] (O64)

## 1. 変更概要
billing は `stripe` パッケージ未導入・checkout 作成 endpoint なし・`api/billing/webhook.ts` ルートなしで、idempotent ロジックの unit test のみ存在し**本番で課金が成立しなかった**。Stripe SDK を導入し、checkout session 作成 + webhook 署名検証 (O64 3 状態) + 冪等トップアップを実装する。

## 2. 変更前 vs 変更後
### 2.2 入出力変更
| 対象 | 変更前 | 変更後 | 互換性 |
|---|---|---|---|
| POST /api/billing/checkout | 存在せず | requireOwner → Stripe Checkout Session 作成 → `{url}` (200) / 未認証 401 | 新規 |
| POST /api/billing/webhook | 存在せず | 署名検証: **不正署名=400** / **無関係イベント=200 ack** / **checkout.session.completed=冪等トップアップ→200** | 新規 |

### 2.3 データモデル変更
| エンティティ | 変更内容 | マイグレーション要否 |
|---|---|---|
| processed_events (新規) | webhook 冪等性 (event id PK) | ✅ 要（005 参照） |
| users.topup_tokens_remaining | webhook で加算 | 既存列、変更なし |

## 3. 影響範囲
| 対象 | 影響度 | 説明 |
|---|---|---|
| billing | 高 | checkout/webhook 実装 |
| _shared/db | 中 | processed_events テーブル追加 |
| _shared/cost-tracking | 低 | topup 反映（既存 quota 連携） |

## 4. 後方互換性
- ✅ 新規エンドポイント追加のみ。既存挙動不変

## 5. ロールバック方針
- コード revert で戻る。processed_events テーブルは drop（005 ロールバック）。topup 済みデータは保持

## 6. リリース戦略
- 一括。実 Stripe キー疎通 (test→live) は release Phase 2 (B-4 実課金まとめ確認)。コード/ルート/署名検証は本改修で no-key 出荷

## 7. 詳細仕様
- checkout: 100 円 (JPY) × packs(1-10)、`client_reference_id=ownerId` + `metadata`、success/cancel URL は request origin から導出（プレースホルダ env 不使用、CF-20260531-002 回避）
- webhook: `stripe.webhooks.constructEvent` で署名検証（nodejs runtime, raw body）。`WebhookSignatureError` を 400 にマップ、無関係 type は 200 ack（Stripe 再送無限ループ + EP 自動無効化を回避）
- 冪等性: processed_events に event id を記録、二度目は applied=false

## 9. 未決事項
論点なし (2026-06-20)。TOKENS_PER_PACK=10000 は 論点-001 暫定確定値を踏襲。

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:revise |
