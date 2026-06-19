# 単体テストレポート: _shared/ai-client

## 実施日時
2026-06-19 (JST)

## テスト実行環境
- Node v22.11.0 / Vitest 2.1.9

## テスト結果
| # | テストケース | 結果 |
|---|---|---|
| N1 | scrub メール/電話/数字 | ✅ |
| — | scrub 通常文は不変 | ✅ |
| — | prompts: user text をデータ明示（SEC-002） | ✅ |
| N2 | callStructure 正常 parse + usage | ✅ |
| B1 | 空 delta は no-op（API 叩かない） | ✅ |
| E1 | injection/malformed → フォールバック | ✅ |
| E2 | 非 JSON リトライ → フォールバック | ✅ |
| E3 | API エラー → フォールバック | ✅ |
| — | callExpand 4 kind | ✅ |

## 追加テストケース
追加なし

## サマリー
| 項目 | 値 |
|---|---|
| 合計 | 9 |
| 成功 | 9 |
| 失敗 | 0 |
| 成功率 | 100% |
