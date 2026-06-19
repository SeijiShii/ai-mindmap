# map-management 機能仕様書

> **役割**: マップの保存・一覧・リネーム・削除（個人ごと複数マップ）+ nodes/edges CRUD の永続化層。
> **タグ**: feature, auth-required
> **最終更新**: 2026-06-19
> **入力**: `../concept.md`, `../_shared/db/`, `../_shared/auth/`

---

## 1. 詳細 UC

### UC: マップ一覧・選択
- 自分のマップ一覧（owner スコープ、updated_at 降順）→ 選択でキャンバスへ
### UC: 新規/リネーム/削除
- 新規作成（空マップ）/ タイトル変更 / 削除（確認 + cascade）
### UC: ノード/エッジ永続化（mindmap-canvas/AI から呼ばれる）
- upsert/delete（楽観更新と協調）

## 2. 入出力
### 2.1 API（Vercel Functions、requireOwner 保護）
| メソッド | パス | 入力 | 出力 |
|---|---|---|---|
| GET | /api/maps | — | MapMeta[]（自分のみ） |
| POST | /api/maps | CreateMapInput | MapMeta |
| PATCH | /api/maps/:id | { title } | MapMeta |
| DELETE | /api/maps/:id | — | ok（cascade） |
| GET | /api/maps/:id/graph | — | MapGraph |
| POST | /api/maps/:id/nodes | UpdateNodeInput[] | ok（upsert） |
| DELETE | /api/maps/:id/nodes/:nid | — | ok |
| POST | /api/maps/:id/edges | edge[] | ok |

### 2.2 副作用
- _shared/db（withOwner 経由、SEC-001）

## 3. データモデル
maps/nodes/edges（_shared/db）。新規エンティティなし。

## 4. バリデーション + エラー
| 条件 | 振る舞い |
|---|---|
| 全 API 入力 | Zod スキーマ（SEC-002、_shared/types） |
| 他人のマップ操作 | withOwner で 404（漏洩しない、SEC-001） |
| 削除 | cascade（nodes/edges）、確認 UI |
| レート（公開ではないが書き込み多） | ユーザー単位の常識的上限 |

## 5. NFR + 連携
### 5.1 NFR
- 一覧/グラフ取得は owner_id/map_id インデックスで高速
- 全 API は requireOwner（_shared/auth）
### 5.2 連携
| 連携先 | 依存 |
|---|---|
| _shared/db | maps/nodes/edges CRUD（withOwner） |
| _shared/auth | requireOwner |
| mindmap-canvas | グラフ取得・永続化 |
| _shared/ui | 一覧 UI |

## 6. タグ別（auth-required）
- 所有者チェック: 全エンドポイントで owner 照合（SEC-001）

## 7. スコープ外
- マップ共有・公開（非対象）

## 8. 未決事項
現時点で論点なし (2026-06-19)

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
