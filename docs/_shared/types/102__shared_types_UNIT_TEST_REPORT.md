# 単体テストレポート: _shared/types

## 実施日時
2026-06-19 (JST)

## テスト実行環境
- Node v22.11.0 / Vitest 2.1.9

## テスト結果
| # | テストケース | 結果 |
|---|---|---|
| N1 | StructureResult parse | ✅ |
| N4 | ExpandResult 4 kind | ✅ |
| E1 | 不正形 reject（injection-ignored 出力） | ✅ |
| B2 | 空 suggestions | ✅ |
| N2 | CreateMapInput | ✅ |
| N3 | UpdateNodeInput 部分 | ✅ |
| E2 | status 不正 reject | ✅ |
| E3/B1 | StructureInput 型/空 | ✅ |
| — | ExpandInput mode default | ✅ |

## 追加テストケース
追加なし

## サマリー
| 項目 | 値 |
|---|---|
| 合計 | 9 |
| 成功 | 9 |
| 失敗 | 0 |
| 成功率 | 100% |
