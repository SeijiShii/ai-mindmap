# _shared/types 共通型仕様書

> **役割**: 全機能が参照する共通型と Zod スキーマ（API 入出力 + AI 構造化出力契約）。
> **タグ**: cross-cutting
> **最終更新**: 2026-06-19
> **入力**: `../../concept.md` §5, `../db/001__shared_db_SPEC.md`

---

## 1. 提供インターフェース
- DB 由来型（Drizzle `$inferSelect`/`$inferInsert` の re-export: User/Map/Node/Edge/UsageLog）
- API/ドメイン型 + Zod スキーマ（バリデーション一元化、SEC-002）
- AI 構造化出力契約（ai-structuring / ai-expand が返す JSON 形）

## 2. 主要型

### 2.1 列挙
- `NodeSource = 'ai' | 'human'`
- `NodeStatus = 'confirmed' | 'suggested'`
- `EdgeKind = 'tree' | 'relation' | 'opposition' | 'question' | 'example'`
- `AiEndpoint = 'structure' | 'expand'`

### 2.2 ドメイン型
- `MindMapNode { id, mapId, parentId, text, posX, posY, source, status, createdAt }`
- `MindMapEdge { id, mapId, sourceNodeId, targetNodeId, kind }`
- `MapMeta { id, ownerId, title, createdAt, updatedAt }`
- `MapGraph { meta, nodes: MindMapNode[], edges: MindMapEdge[] }`

### 2.3 AI 構造化出力契約（SEC-002: 出力を JSON に制約）
- `AiNodeSuggestion { tempId, parentRef, text, kind: EdgeKind }`
- `StructureResult { suggestions: AiNodeSuggestion[] }` — 逐次マージ用の差分提案
- `ExpandResult { suggestions: AiNodeSuggestion[] }` — 枝提案（関連/対立/問い/具体例）
- いずれも Zod スキーマで parse（LLM 出力を信頼境界として検証）

### 2.4 API 入力スキーマ（Zod、SEC-002）
- `CreateMapInput { title? }`
- `UpdateNodeInput { id, text?, posX?, posY?, status? }`
- `StructureInput { mapId, transcriptDelta: string }`（PII scrub 後）
- `ExpandInput { mapId, nodeId }`

## 3. データモデル
DB 由来は `_shared/db` の single source。本フォルダは型の re-export + ドメイン/API 型 + Zod のみ（テーブル再定義しない）。

## 4. バリデーション
- 全 API 入力は Zod スキーマ経由（境界で reject）
- AI 出力は Zod parse 失敗時にリトライ/フォールバック（ai-client 責務）

## 5. NFR + 連携
- 連携: _shared/db（型ソース）/ ai-structuring・ai-expand（AI 契約）/ 全 feature（ドメイン型）
- 不変条件: 型は単一定義、重複定義禁止

## 7. スコープ外
- ランタイムロジック（型 + スキーマのみ）

## 8. 未決事項
現時点で論点なし (2026-06-19)

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
