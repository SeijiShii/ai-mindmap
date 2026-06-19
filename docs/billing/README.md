# billing

Stripe 単発課金（PWYW、AI 無料枠 + 100 円追加枠）、Webhook 署名検証。

## このフォルダに置くドキュメント

- `001_billing_SPEC.md` — 仕様書（`/flow:feature` で生成）
- `002_billing_PLAN.md` — 実装計画書
- `003_billing_UNIT_TEST.md` — 単体テスト計画
- `004_billing_E2E_TEST.md` — E2E テスト計画
- `estimate_YYYYMMDD.md` — 機能単位見積もり

## 関連

- 概念設計: `../concept.md` §1.3.1
- 依存: _shared/db, _shared/auth, _shared/cost-tracking
- 実装コード対応: `src/features/billing/`（§1.4 参照）
