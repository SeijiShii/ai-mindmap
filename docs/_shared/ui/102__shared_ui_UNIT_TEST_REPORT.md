# 単体テストレポート: _shared/ui

## 実施日時
2026-06-19 (JST)

## テスト実行環境
- Node v22.11.0 / Vitest 2.1.9 / jsdom / @testing-library/react

## テスト結果
| # | テストケース | 結果 |
|---|---|---|
| N1 | Button primary トークンクラス | ✅ |
| E1 | Button disabled 非クリック | ✅ |
| N2 | Chip kind=relation accent 色 | ✅ |
| B1 | AppHeader 長タイトル nowrap+ellipsis | ✅ |
| N4 | InfoButton モーダル open（O41） | ✅ |
| N5 | StageSpinner 段階文言（O45） | ✅ |

## 追加テストケース
追加なし

## サマリー
| 項目 | 値 |
|---|---|
| 合計 | 6 |
| 成功 | 6 |
| 失敗 | 0 |
| 成功率 | 100% |

> 視覚レビュー（実画面スクショ評価, Design gate b）は画面実装後に `/flow:design --review-only` で実施。
