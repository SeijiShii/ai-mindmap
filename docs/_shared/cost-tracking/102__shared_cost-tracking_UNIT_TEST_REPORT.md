# 単体テストレポート: _shared/cost-tracking

## 実施日時
2026-06-19 (JST)

## テスト実行環境
- Node v22.11.0 / Vitest 2.1.9

## テスト結果
| # | テストケース | 結果 |
|---|---|---|
| N1 | estimateCost = tokens×単価 | ✅ |
| E3 | ratesFromEnv デフォルト fallback | ✅ |
| — | ratesFromEnv env 読込 | ✅ |
| N3 | consume free→topup（mixed） | ✅ |
| E1 | 枯渇で blocked / consume 失敗 | ✅ |
| N4 | 月次 lazy リセット補充 | ✅ |
| — | 新規ユーザー満枠 default | ✅ |
| — | addTopup 補充 | ✅ |
| B2 | alertLevel 閾値（80/100/120） | ✅ |

## 追加テストケース
追加なし

## サマリー
| 項目 | 値 |
|---|---|
| 合計 | 9 |
| 成功 | 9 |
| 失敗 | 0 |
| 成功率 | 100% |
