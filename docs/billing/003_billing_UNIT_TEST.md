# billing 単体テスト計画

> **入力**: `./001_billing_SPEC.md`, `./002_billing_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N1 | checkout | Checkout Session URL 返却 |
| N2 | webhook 成功 | topup_tokens 補充 |
| N3 | UpgradePanel | 価格 + 対価が CTA 前に表示（O43） |

### 1.2 異常系
| ID | 対象 | 期待 |
|---|---|---|
| E1 | webhook 署名不正 | 拒否（補充しない） |
| E2 | 同一 event 二度 | 冪等（一度だけ補充） |
| E3 | 未認証 checkout | 401 |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | 補充後ちょうど枠回復 | — | AI 再利用可 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| Stripe | mock（Session/event/署名） |
| cost-tracking | spy（topup 補充） |

## 3. カバレッジ目標
行 80% / 分岐 70%

## 4. 既存ユーティリティ依存
stripe, _shared/cost-tracking, _shared/auth

## 5. テスト実行環境
Vitest（handler 単体）+ jsdom（UpgradePanel）

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
