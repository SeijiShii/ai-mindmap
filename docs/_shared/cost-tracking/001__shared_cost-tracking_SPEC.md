# _shared/cost-tracking コスト集計基盤 仕様書

> **役割**: §4.6.2 コスト集計メカニズム。usage_log 積算 + .env 単価 + 概算コスト + 無料枠管理/アラート。
> **タグ**: cross-cutting
> **最終更新**: 2026-06-19
> **入力**: `../../concept.md` §4.6, `../db/`

---

## 1. 提供インターフェース
- `recordUsage({ ownerId, endpoint, inputTokens, outputTokens })` — usage_log 書き込み + cost 算出
- `estimateCost(inputTokens, outputTokens)` — .env 単価 × tokens
- `getMonthlyUsage(ownerId)` — 当月の消費トークン/コスト集計
- `checkQuota(ownerId)` — 無料枠 + 追加枠の残量判定（80%/100% 閾値）
- `consumeQuota(ownerId, tokens)` — 枠を消費（free 優先 → topup）

## 2. 入出力
| 関数 | 入力 | 出力 | 副作用 |
|---|---|---|---|
| recordUsage | usage | cost_estimate | usage_log insert |
| checkQuota | ownerId | { remaining, pct, blocked } | — |
| consumeQuota | ownerId, tokens | { ok, source } | users.free/topup 更新 |

## 3. データモデル
- usage_log（_shared/db）への書き込み
- users.free_tokens_remaining / topup_tokens_remaining / free_tokens_reset_at の参照・更新
- 月次 lazy リセット（参照時に reset_at 経過なら補充、_shared/db 論点-001 案A）

## 4. バリデーション / セキュリティ（SEC-004）
| 項目 | 対策 |
|---|---|
| 単価 | `.env`（COST_OPENAI_GPT4O_MINI_PER_1K_INPUT/OUTPUT_TOKENS）、ハードコード禁止 |
| 枠超過 | checkQuota=blocked なら呼び出し側 API が 402/案内（100円追加枠へ） |
| アラート | 80%/100% で通知（本人向け、Sentry/メール）。120% 全体閾値で運用者通知 |

## 5. NFR + 連携
- 高頻度ライブ呼び出しでも軽量（インデックス usage_log(owner_id, created_at)）
- 連携: _shared/db / ai-client（usage 受領）/ billing（追加枠購入 → topup 補充）/ ai-structuring・ai-expand（consumeQuota ゲート）

## 6. タグ別
（cross-cutting）

## 7. スコープ外
- 外部請求ダッシュボード突合（運用手動、§4.6.2 精度検証）

## 8. 未決事項
現時点で論点なし（無料枠トークン量は concept §8 論点-001 で別途、ここは仕組みのみ）(2026-06-19)

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
