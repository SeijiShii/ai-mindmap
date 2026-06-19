# 単体テストレポート: _shared/app-shell

## 実施日時
2026-06-19 (JST) / Node v22 / Vitest 2.1.9 / jsdom

## テスト結果
| # | ケース | 結果 |
|---|---|---|
| APP-S1 | ヘッダ/入口リード/InfoButton 表示 | ✅ |
| APP-S4/O55 | フッタ legal 導線(到達性) | ✅ |
| — | legal ルート遷移 | ✅ |
| — | 404 ルート | ✅ |
| O41 | InfoButton モーダル | ✅ |
| APP-S3/P4.46 | structure API 401（未認証） | ✅ |
| — | 400 不正入力(SEC-002) | ✅ |
| AS-S3/SEC-004 | 402 quota blocked | ✅ |
| AS-S1 | 200 マージ追加 + usage 記録 | ✅ |
| AS-S2 | 空 delta no-op(コスト節約) | ✅ |

## サマリー
合計 10 / 成功 10 / 100%。`vite build` 成功。
> リッチ画面の視覚レビューは Design gate(画面実装後)。
