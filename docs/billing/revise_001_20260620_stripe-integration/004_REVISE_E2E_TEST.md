# billing E2E テスト計画（Stripe 実連携）

> **入力**: 001_REVISE_SPEC, concept §1.1 UC7
> **最終更新**: 2026-06-20

## 1. 変更 UC シナリオ（UC7）
| ID | 前提 | 操作 | 期待 |
|---|---|---|---|
| E-B-1 | 無料枠枯渇 (402) | UpgradePanel「100 円で追加」→ startCheckout | Stripe Checkout へリダイレクト |
| E-B-2 | Stripe test カード決済完了 | webhook 受信 | topup_tokens_remaining +10000、AI 再利用可 |
| E-B-3 | 署名偽装した webhook | POST | 400、補充されない |

## 2. リグレッションシナリオ
| UC | ID | 観点 |
|---|---|---|
| AI 利用 | E-Q-1 | topup 反映後に quota ブロック解除 |

## 4. 環境要件差分
| 項目 | 前回 | 今回 |
|---|---|---|
| Stripe | mock | test キー (release Phase 2)、live は B-4 |
| DB | — | processed_events テーブル (migration apply) |

> 実 Stripe 決済 E2E は release Phase 2 / `/flow:e2e`。署名 3 状態 + 冪等は unit で検証済。

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:revise |
