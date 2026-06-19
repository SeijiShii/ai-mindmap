# 単体テストレポート: ai-structuring

## 実施日時
2026-06-19 (JST) / Node v22 / Vitest 2.1.9

## テスト結果（9/9）
| # | ケース | 結果 |
|---|---|---|
| N2 | 新規追加 | ✅ |
| E4 | 既存を変更しない（追加のみ） | ✅ |
| N3 | 既存 dedup | ✅ |
| — | バッチ内 dedup | ✅ |
| — | 上限 cap | ✅ |
| — | parentRef 解決（迷子→root） | ✅ |
| B1 | 空テキスト skip | ✅ |
| — | summarizeTree アウトライン | ✅ |
| — | 大規模ツリー境界 | ✅ |

## サマリー
合計 9 / 成功 9 / 失敗 0 / 100%
> API ルート(/api/structure)+throttle は app-shell 合成時に配線。
