# billing 単体テスト計画（Stripe 実連携）

> **入力**: 001_REVISE_SPEC, 002_REVISE_PLAN
> **最終更新**: 2026-06-20

## 1. 追加テストケース（src/app/api-billing.test.ts）
| ID | 対象 | 入力 | 期待 |
|---|---|---|---|
| C1 | checkout | 未認証 | 401 |
| C2 | checkout | pack=2 | 200 `{url}`、createCheckoutSession(owner,2,origin) |
| C3 | checkout | pack=99 | clamp→10 |
| W1 (O64-1) | webhook | verifyEvent が SignatureError | 400、grantTopup 未呼出 |
| W2 (O64-2) | webhook | type=invoice.paid | 200 ignored、grantTopup 未呼出 |
| W3 (O64-3) | webhook | checkout.session.completed | 200 applied、grantTopup(owner, 10000) |
| W4 | webhook 冪等 | 同 event id 二連 | grantTopup 1 回のみ |

## 1b. checkout-client.test.ts
| ID | 対象 | 期待 |
|---|---|---|
| CC1 | startCheckout | POST + redirect(url) |
| CC2 | 非 ok 応答 | throw、redirect なし |

## 4. リグレッション強化
既存 webhook.ts processCheckoutEvent (idempotent) のロジックは不変、ハンドラ層から再利用。schema.test テーブル数更新。

## 6. カバレッジ目標
| 種別 | 目標 |
|---|---|
| api-billing.ts 分岐 (3 状態 + 冪等) | 100% |

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:revise |
