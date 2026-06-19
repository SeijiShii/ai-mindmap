# _shared/db スキーマ仕様書

> **役割**: Neon (Postgres) + Drizzle のスキーマ・マイグレーション基盤。maps / nodes / edges / usage_log / users。
> **タグ**: cross-cutting, auth-required（所有者スコープ SEC-001）
> **最終更新**: 2026-06-19
> **入力アーティファクト**: `../../concept.md` (§5, §3.X, §4.6), `./README.md`

---

## 1. 提供インターフェース（cross-cutting）

横断基盤として以下を提供する（UI なし）:
- Drizzle スキーマ定義（テーブル + リレーション + enum）
- マイグレーションファイル（`drizzle-kit generate`）
- DB クライアント（Neon serverless driver + Drizzle、サーバ side のみ）
- **所有者スコープを強制する基盤**（`withOwner` リポジトリ層の土台、SEC-001）

## 2. 入出力

### 2.1 提供する型・関数（シグネチャ概要）
| 名前 | 種別 | 説明 |
|---|---|---|
| `db` | Drizzle クライアント | `drizzle(neon(DATABASE_URL), { schema })` |
| `schema.{users,maps,nodes,edges,usageLog}` | テーブル定義 | Drizzle table |
| `withOwner(ownerId, fn)` | ヘルパ（土台） | 所有者スコープを必須にするクエリラッパ（_shared/auth と協調） |

### 2.2 副作用
- DB 書き込み: 全テーブル
- 外部呼び出し: Neon（Postgres over HTTP/WebSocket）

## 3. データモデル

### 3.1 新規エンティティ

#### users
| フィールド | 型 | 制約 | 備考 |
|---|---|---|---|
| id | text | PK | Clerk user_id（匿名ゲストも同 id を保持、連携後も不変） |
| is_guest | boolean | not null, default true | ゲスト/アカウント区別 |
| free_tokens_remaining | integer | not null, default（月次枠） | 無料 AI トークン残（§4.6.2） |
| free_tokens_reset_at | timestamptz | not null | 月次リセット時刻 |
| topup_tokens_remaining | integer | not null, default 0 | 100円追加枠の残トークン |
| created_at | timestamptz | not null, default now() | |

#### maps
| フィールド | 型 | 制約 | 備考 |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | |
| owner_id | text | not null, FK users.id, **index** | 所有者（SEC-001） |
| title | text | not null, default '無題のマップ' | |
| created_at | timestamptz | not null, default now() | |
| updated_at | timestamptz | not null, default now() | |

#### nodes
| フィールド | 型 | 制約 | 備考 |
|---|---|---|---|
| id | uuid | PK | |
| map_id | uuid | not null, FK maps.id on delete cascade, **index** | |
| parent_id | uuid | nullable, FK nodes.id on delete cascade | ツリー親（ルートは null） |
| text | text | not null | ノード本文 |
| pos_x | real | not null, default 0 | キャンバス座標 |
| pos_y | real | not null, default 0 | |
| source | text(enum) | not null | `ai` \| `human` |
| status | text(enum) | not null, default 'confirmed' | `confirmed` \| `suggested`（AI 提案=未承認） |
| created_at | timestamptz | not null, default now() | |

#### edges
| フィールド | 型 | 制約 | 備考 |
|---|---|---|---|
| id | uuid | PK | |
| map_id | uuid | not null, FK maps.id on delete cascade, **index** | |
| source_node_id | uuid | not null, FK nodes.id on delete cascade | |
| target_node_id | uuid | not null, FK nodes.id on delete cascade | |
| kind | text(enum) | not null, default 'tree' | `tree`\|`relation`\|`opposition`\|`question`\|`example` |

#### usage_log
| フィールド | 型 | 制約 | 備考 |
|---|---|---|---|
| id | uuid | PK | |
| owner_id | text | not null, FK users.id, **index(owner_id, created_at)** | |
| endpoint | text(enum) | not null | `structure` \| `expand` |
| input_tokens | integer | not null | |
| output_tokens | integer | not null | |
| cost_estimate_usd | numeric(10,6) | not null, default 0 | §4.6.2 .env 単価 × tokens |
| created_at | timestamptz | not null, default now() | |

### 3.2 リレーション
- users 1—N maps（owner_id）
- maps 1—N nodes / edges（cascade delete）
- nodes 自己参照（parent_id）
- users 1—N usage_log

## 4. バリデーション + エラーケース

### 4.1 制約
| 対象 | ルール |
|---|---|
| nodes.source / status, edges.kind, usage_log.endpoint | enum（Drizzle `text` + check / `pgEnum`） |
| FK | 全 child は親 cascade delete |
| owner_id | 必須（NULL 不可、孤児レコード禁止） |

### 4.2 エラーケース
| 条件 | 振る舞い |
|---|---|
| 存在しない owner_id で書き込み | FK 違反 → 上位でハンドル（_shared/auth が user upsert を保証） |
| 他人の map_id を参照 | アプリ層 `withOwner` で所有者照合し 403/404（SEC-001） |
| マイグレーション競合 | drizzle-kit のバージョン管理で検出 |

## 5. 機能固有 NFR + 連携

### 5.1 NFR
| 項目 | 目標 | 根拠 |
|---|---|---|
| 所有者スコープ | 全 maps/nodes/edges/usage_log クエリは owner 照合必須（アプリ層強制） | SEC-001（§3.X） |
| クエリ性能 | owner_id / map_id にインデックス、数百ノード規模でスムーズ | §3 キャンバス性能 |

> **RLS でなくアプリ層強制を採用**: Neon + Vercel Functions は単一 DB ロールで接続するため Postgres RLS（auth.uid() 依存）が効きにくい。代わりに `withOwner` リポジトリ層で全クエリに `owner_id = :ctxOwner` を必須化する（_shared/auth が ctxOwner を Clerk セッションから供給）。

### 5.2 連携
| 連携先 | 依存内容 |
|---|---|
| _shared/auth | ctxOwner（Clerk user_id）供給、user upsert |
| _shared/cost-tracking | usage_log への積算書き込み |
| map-management / mindmap-canvas | maps/nodes/edges CRUD |

## 7. スコープ外
- リアルタイム同期（多人数）— 非対象（concept §1.2）
- 音声/画像 BLOB 保管 — v2（MVP は非保存）

## 8. 未決事項
### [論点-001] 月次無料枠リセットの実装方式
- **影響範囲**: users.free_tokens_reset_at, _shared/cost-tracking, billing
- **詰めるべき問い**: 月次リセットを cron バッチで一括更新するか、参照時に lazy リセットするか
- **候補案**: 案A lazy（参照時に reset_at 経過なら補充）/ 案B Vercel Cron 月次一括
- **推奨**: 案A lazy（無料・サーバーレス親和、cron 不要）。理由: 無料枠厳守、ユーザー数少で十分
- **判断期限**: cost-tracking / billing 設計時
- **担当**: 本人

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
