# feedback 機能仕様書

> **役割**: 好き嫌い 👍/👎 + バグ報告ウィジェット。自動コンテキスト（PII scrub）+ 二重シンク（即時通知 + 中央 feedback-hub）。
> **タグ**: feature
> **最終更新**: 2026-06-19
> **入力**: `../concept.md` §1.3, §3 NFR, perspectives O40

---

## 1. 詳細 UC
### UC: フィードバック送信（perspectives O40）
- トリガー: どの画面からでも 1 タップ（👍/👎 リアクション or バグ報告）
- 入力: 任意の自由記述 + 任意スクショ + 自動コンテキスト（画面/route/version/UA/時刻）
- 処理: **送信前 PII scrub**（メール/位置/本文の個人情報、SEC-003/O28）→ feedback-hub の `POST /api/feedback`（service ID 付き）
- 出力: 「ありがとう」控えめフィードバック

## 2. 入出力
| 処理 | 入力 | 出力 | 副作用 |
|---|---|---|---|
| 送信 | { kind:like/dislike/bug, text?, screenshot?, context } | ok | hub ingestion + 即時通知 |

## 3. データモデル
ローカル保存は最小（送信のみ）。hub 側が蓄積。

## 4. バリデーション + エラー
| 条件 | 振る舞い |
|---|---|
| PII | 送信前 scrub 必須（SEC-003、§3 NFR） |
| hub ダウン | キュー/再送 or ローカル即時通知のみ |
| スパム | レート（簡易） |

## 5. NFR + 連携
### 5.1 NFR
- 自動コンテキストの PII scrub（§3 NFR）
- 軽量（どの画面からでも 1 タップ）
### 5.2 連携
| 連携先 | 依存 |
|---|---|
| feedback-hub（別 PJ） | `POST /api/feedback`（service ID + endpoint env） |
| 即時通知チャンネル | Slack/Telegram/メール（運用者が気づく） |
| _shared/ui | ウィジェット |

## 6. タグ別
（feature）

## 7. スコープ外
- hub 本体の構築（別 PJ、§8 論点-003）

## 8. 未決事項
### [論点-001]（= concept §8 論点-003）feedback-hub 構築状況
- **影響範囲**: 二重シンクの中央集約
- **問い**: 共有 hub は既存か、本 PJ で別途立ち上げか
- **推奨**: 既存なら endpoint 設定のみ。無ければ MVP はローカル即時通知（メール/Slack）のみ、hub 連携は後追い（hub は別 PJ で `/flow:ideate`→`/flow:concept`）
- **判断期限**: 公開前
- **担当**: 本人

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
