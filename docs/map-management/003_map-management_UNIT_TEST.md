# map-management 単体テスト計画

> **入力**: `./001_map-management_SPEC.md`, `./002_map-management_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N1 | maps-repo list | owner の maps のみ、updated_at 降順 |
| N2 | create/patch/delete | CRUD 成功、cascade |
| N3 | graph 取得 | nodes/edges 揃う |
| N4 | API Zod | 正入力で 200 |

### 1.2 異常系
| ID | 対象 | 期待 |
|---|---|---|
| E1 | 他人 map 取得 | 404（漏洩なし、SEC-001） |
| E2 | 未認証 | 401（requireOwner） |
| E3 | 不正入力 | 400（Zod、SEC-002） |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | マップ 0 件 | 空 | 空配列 |
| B2 | 大量ノード upsert | 数百 | バッチ処理成功 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| _shared/db | pg-mem |
| _shared/auth | requireOwner を固定 owner で mock（ただし他人アクセスは実ロジック検証） |

## 3. カバレッジ目標
行 80% / 分岐 70%

## 4. 既存ユーティリティ依存
_shared/db, _shared/auth, _shared/types, TanStack Query

## 5. テスト実行環境
Vitest（API は handler 単体）+ @testing-library（MapList）

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
