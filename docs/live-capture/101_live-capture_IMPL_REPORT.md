# 実装レポート: live-capture

## 実装日時
2026-06-19 (JST)

## モード
feature

## 変更一覧
- 句点/文字数デバウンス + オフラインキュー/drain(論点-001)

## 実装計画からの差分
- delta-buffer。Web Speech フックは app-shell（O35 injectable / 合成は app-shell）。本セッションはコアロジックを実装・検証。

## PR Description
### タイトル
live-capture: DeltaBuffer(デバウンス/オフライン)
### テスト
- 4 ケース green、typecheck clean（全体 85/85）
