# billing 機能仕様書

> **役割**: Stripe 単発課金（PWYW）。AI 無料枠超過時に 100円で追加トークン枠を購入。継続課金なし。
> **タグ**: feature, auth-required
> **最終更新**: 2026-06-19
> **入力**: `../concept.md` §1.1 UC7, §4.6, §9.4, charter §1（PWYW）

---

## 1. 詳細 UC
### UC7: 追加枠購入（concept §1.1 #7）
- トリガー: 枠枯渇案内 →「100円で追加」
- 処理: Stripe Checkout（単発）→ 成功 Webhook → topup_tokens_remaining 補充
- 出力: 追加枠反映、AI 再利用可
- アカウント連携: ゲストは購入時にアカウント連携を促す（領収/再利用のため、_shared/auth）

## 2. 入出力
| メソッド | パス | 入力 | 出力 |
|---|---|---|---|
| POST | /api/billing/checkout | { pack } | Stripe Checkout URL |
| POST | /api/billing/webhook | Stripe event（署名付き） | ok（topup 補充） |

### 副作用
- Stripe Checkout Session 作成
- Webhook で users.topup_tokens_remaining 加算（cost-tracking 連携）

## 3. データモデル
users.topup_tokens_remaining 更新。purchase ログ（任意、usage_log とは別 or メタ）。

## 4. バリデーション + エラー
| 条件 | 振る舞い |
|---|---|
| Webhook 署名 | STRIPE_WEBHOOK_SECRET で検証必須（偽装防止） |
| 二重補充 | event id 冪等性（同一イベント二度補充しない） |
| 未認証 checkout | requireOwner（ゲストでも owner_id 必須） |
| 価格透明性 | 「100円で N トークン（≒ M 回相当）」を CTA 前に明示（O43、charter §2.2） |

## 5. NFR + 連携
### 5.1 NFR
- 月固定費ゼロ（Stripe 従量手数料のみ、preferences §4.5）
- 価格透明性（O43）: 金額 + 対価をファーストビューに
### 5.2 連携
| 連携先 | 依存 |
|---|---|
| _shared/cost-tracking | topup 補充、枠枯渇トリガ |
| _shared/auth | アカウント連携（購入時） |
| Stripe | Checkout + Webhook |

## 6. タグ別（auth-required）
- 所有者: 購入は owner に紐づく

## 7. スコープ外
- サブスク（非採用、charter §1 単発のみ）
- 複数価格プラン（MVP は 100円単一、preferences §4.5「100円応援」基調）

## 8. 未決事項
### [論点-001]（= concept §8 論点-001）100円追加枠のトークン量
- **影響範囲**: §4.6.2, cost-tracking
- **問い**: 100円で何トークン付与するか（≒ 何回/何分相当）
- **推奨**: 無料枠の月量と整合する量を設定（gpt-4o-mini 単価から逆算、利益でなく実費 + 余裕）。理由: charter §1「応援」基調、利益目的でない
- **判断期限**: tdd 実装・pricing 確定時
- **担当**: 本人

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
