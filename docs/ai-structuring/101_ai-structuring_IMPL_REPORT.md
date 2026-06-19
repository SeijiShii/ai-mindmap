# 実装レポート: ai-structuring

## 実装日時
2026-06-19 (JST)

## モード
feature

## 変更一覧
### Phase 1: tree-summary + merge（コア差別化、論点-002）
- `src/features/ai-structuring/merge.ts` — `mergeSuggestions`：追加のみ（既存を変更しない）+ 既存/バッチ内 dedup（正規化テキスト）+ 上限 + parentRef 解決（既存id/同バッチtempId/迷子→root）
- `src/features/ai-structuring/tree-summary.ts` — `summarizeTree`：トークン節約の字下げアウトライン + 大規模ツリー境界

## 実装計画からの差分
- API ルートハンドラ（/api/structure）+ throttle は app-shell 合成時に requireOwner/quota/ai-client と配線（O35）。本セッションはコア差別化ロジックを実装・検証。

## PR Description
### タイトル
ai-structuring: 逐次マージコア（追加のみ・dedup）
### テスト
- 9/9 パス（追加のみ/dedup/上限/parent解決/要約）、typecheck clean（累計 63/63）
