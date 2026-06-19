# billing E2E テスト計画

> **入力**: `./001_billing_SPEC.md`, `../concept.md` §1.1
> **最終更新**: 2026-06-19

---

## 1. ユーザージャーニー
| シナリオ ID | 前提 | 操作 | 期待結果 |
|---|---|---|---|
| BL-S1 (paywall) | 枠枯渇 | UpgradePanel 表示 | 「100円で N トークン（≒M回）」が CTA 前に明示（O43） |
| BL-S2 (checkout) | 枠枯渇 | 「追加」クリック | Stripe Checkout へ（mock/test） |
| BL-S3 (webhook) | 購入完了 mock | webhook 受信 | 枠補充、AI 再利用可 |

## 2. 環境要件
| 項目 | 要件 |
|---|---|
| ブラウザ | Chromium |
| 認証 | ゲスト→連携 |
| Stripe | test モード / mock（実課金は release B-4） |

## 3. データセットアップ
- Seed: ゲスト（枠枯渇状態）
- Cleanup: 削除

## 4. タグ別追加
- auth-required: 購入は owner 紐付け

## 5. レイアウト・ビジュアル検証（O34）
- **Level 1 (snapshot)**: ✅ — UpgradePanel
- **Level 2 (意味的)**: ✅ — **価格 + 対価が購入 CTA より前・ファーストビュー内（O43 価格透明性、必須）**
- **Level 3**: ❌

## 6. 期待 KPI
- 成功率 100%、O43 価格透明性 必須 pass

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
