# 実装レポート: legal

## 実装日時
2026-06-19 (JST)

## モード
feature

## 変更一覧
- owner-scoped cascade 削除(maps→usage→user)

## 実装計画からの差分
- delete-account。ページ/API は app-shell（O35 injectable / 合成は app-shell）。本セッションはコアロジックを実装・検証。

## PR Description
### タイトル
legal: deleteAllData(O54 セルフ削除)
### テスト
- 2 ケース green、typecheck clean（全体 85/85）
