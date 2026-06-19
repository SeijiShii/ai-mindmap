# map-management 実装計画書

> **入力**: `./001_map-management_SPEC.md`
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/features/map-management/maps-repo.ts` | maps/nodes/edges リポジトリ（withOwner） | _shared/db | 130 |
| `api/maps/index.ts` | GET/POST /api/maps（requireOwner + Zod） | maps-repo, _shared/auth | 60 |
| `api/maps/[id].ts` | PATCH/DELETE + graph 取得 | maps-repo | 70 |
| `api/maps/[id]/nodes.ts` | nodes upsert/delete | maps-repo | 50 |
| `api/maps/[id]/edges.ts` | edges upsert | maps-repo | 40 |
| `src/features/map-management/MapList.tsx` | 一覧 UI（新規/リネーム/削除） | _shared/ui, TanStack Query | 120 |
| `src/features/map-management/api-client.ts` | フロント側 fetch ラッパ（TanStack Query） | — | 60 |

## 2. 実装 Phase 分割
### Phase 1: maps-repo（withOwner、CRUD）
- テスト: owner スコープ、cascade、漏洩なし（SEC-001）
### Phase 2: API ルート（requireOwner + Zod）
- テスト: 401/404、入力検証
### Phase 3: MapList + api-client（TanStack Query）
- テスト: 一覧/作成/削除 UI

### Phase 3.5: app/api bootstrap
- @clerk/backend, drizzle 配線（app-shell と協調）

## 3. 依存関係順序
```
maps-repo → API ルート → api-client → MapList
```

## 4. 既存ファイルへの影響
なし

## 5. 横断への変更
_shared/db を消費。app-shell が API ルートを束ねる。

## 6. リスク
- withOwner を経由しない生クエリ混入防止（規律 + レビュー）

## 7. DoD
- [ ] Phase 1-3 完了、owner スコープ/401/404 テスト green
- [ ] E2E（004）green
- [ ] 視覚レビュー Design gate

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
