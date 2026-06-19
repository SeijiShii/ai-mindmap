# billing 実装計画書

> **入力**: `./001_billing_SPEC.md`
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `api/billing/checkout.ts` | Stripe Checkout Session 作成（requireOwner） | stripe, auth | 60 |
| `api/billing/webhook.ts` | 署名検証 + 冪等 + topup 補充 | stripe, cost-tracking | 80 |
| `src/features/billing/UpgradePanel.tsx` | 枠枯渇案内 + 価格明示（O43）+ Checkout 導線 | _shared/ui | 90 |

## 2. 実装 Phase 分割（injectable + interface、O35）
### Phase 1: webhook（署名検証 + 冪等 + topup 補充ロジック）
- mock Stripe event でテスト
### Phase 2: checkout（Session 作成）
- mock Stripe
### Phase 3: UpgradePanel（価格透明性 O43）
- テスト: 金額 + 対価が CTA 前に表示
### Phase 3.5: 実 Stripe SDK install + 配線（dev key）

## 3. 依存関係順序
```
webhook(冪等/補充) → checkout → UpgradePanel
```

## 4. 既存ファイルへの影響
なし

## 5. 横断への変更
cost-tracking.consumeQuota/topup 補充、auth 連携。

## 6. リスク
- Webhook 署名検証必須（偽装補充防止、SEC）
- 二重補充防止（event id 冪等）
- 実課金は B-4（release で test→live、本人承認）

## 7. DoD
- [ ] Phase 1-3 完了、署名/冪等/価格透明性 テスト green
- [ ] E2E（004）green（Stripe mock）
- [ ] 視覚レビュー Design gate（O43 価格透明性）

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
