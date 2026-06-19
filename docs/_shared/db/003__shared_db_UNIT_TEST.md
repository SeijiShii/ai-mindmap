# _shared/db 単体テスト計画

> **入力**: `./001__shared_db_SPEC.md`, `./002__shared_db_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース一覧

### 1.1 正常系
| ID | 対象 | 入力 | 期待出力 |
|---|---|---|---|
| N1 | users CRUD | upsert(guest user) | id 保持、is_guest=true、free_tokens 既定値 |
| N2 | maps CRUD | insert(owner_id, title) | id 生成、updated_at 設定 |
| N3 | nodes ツリー | insert root + child(parent_id) | 親子関係取得可 |
| N4 | edges | insert(kind='relation') | enum 受理 |
| N5 | cascade delete | delete map | 紐づく nodes/edges 全削除 |
| N6 | withOwner | ownerId 一致で maps 取得 | 自分の map のみ返る |
| N7 | usage_log | insert(endpoint='structure', tokens) | cost_estimate 保存 |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待振る舞い |
|---|---|---|---|
| E1 | withOwner | 他人の map_id | 空 or 403/404（漏洩しない、SEC-001） |
| E2 | enum 違反 | source='invalid' | 制約エラー |
| E3 | FK 違反 | 存在しない owner_id で maps insert | FK エラー |
| E4 | owner なしクエリ | withOwner を経由しない maps 全取得 | 設計上禁止（土台が ownerId 必須） |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | nodes.text | 空文字 / 長文（数千字） | 受理（NOT NULL のみ） |
| B2 | parent_id | null（ルート） | 受理 |
| B3 | free_tokens_remaining | 0 | 受理（枯渇状態） |

## 2. Mock 方針
| 対象 | 方針 | 理由 |
|---|---|---|
| Neon DB | pg-mem（高速）+ 重要クエリは Neon dev ブランチ結合 | 再現性 + Neon 固有挙動確認 |
| 時刻（created_at/reset_at） | 固定値注入 | テスト再現性 |
| uuid | gen は DB 任せ、アサートは存在のみ | |

## 3. カバレッジ目標
| 種別 | 目標 | 根拠 |
|---|---|---|
| 行 | 80% | concept 継承 |
| 分岐 | 70% | concept 継承 |

## 4. 既存ユーティリティ依存
なし（最初の実装対象）

## 5. テスト実行環境
- フレームワーク: Vitest（concept §4.3 スタック）
- 並列実行: ✅
- 実行: テストツールを実行（例: `npm run test`）

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
