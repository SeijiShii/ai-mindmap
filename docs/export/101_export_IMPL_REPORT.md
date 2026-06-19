# 実装レポート: export

## 実装日時
2026-06-19 (JST)

## モード
feature

## 変更一覧
- toMarkdown(入れ子)/toOutline(タブ)/escapeFormula(CSV injection SEC-002)

## 実装計画からの差分
- exporters。UI は app-shell（O35 injectable / 合成は app-shell）。本セッションはコアロジックを実装・検証。

## PR Description
### タイトル
export: エクスポート(escape/markdown/outline)
### テスト
- 3 ケース green、typecheck clean（全体 85/85）
