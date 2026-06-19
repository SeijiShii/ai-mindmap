# 実装レポート: _shared/types

## 実装日時
2026-06-19 (JST)

## モード
feature (cross-cutting)

## 関連ドキュメント
- 001/002/003 + [AI_LOG](../AI_LOG/D20260619_022_tdd__shared_types.md)

## 変更一覧
### Phase 1: domain + ai-contract + api
- `src/types/domain.ts` — DB 由来型 re-export（$inferSelect: User/MapMeta/MindMapNode/MindMapEdge/UsageLogRow）+ 列挙 union + MapGraph
- `src/types/ai-contract.ts` — AI 構造化出力 Zod（aiNodeSuggestion/StructureResult/ExpandResult、SEC-002 出力検証）
- `src/types/api.ts` — API 入力 Zod（CreateMap/UpdateNode/Structure/Expand Input、SEC-002 境界検証）
- `src/types/index.ts` — re-export

## 実装計画からの差分
計画通り。型は DB を single source とし再定義なし。

## PR Description
### タイトル
_shared/types: 共通型 + Zod 契約（SEC-002）
### 変更内容
- DB 由来型 re-export / AI 出力 Zod / API 入力 Zod
### テスト
- 9/9 パス（AI 契約 4 + API 5）、typecheck clean
